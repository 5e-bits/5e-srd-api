const AbilityScoreModel = require('../../models/abilityScore');
const ConditionModel = require('../../models/condition');
const DamageTypeModel = require('../../models/damageType');
const MonsterModel = require('../../models/monster');
const ProficiencyModel = require('../../models/proficiency');
const SpellModel = require('../../models/spell');
const { levelObjectToArray } = require('./common');

const resolveDc = async dc => ({
  type: await AbilityScoreModel.findOne({ index: dc.dc_type.index }).lean(),
  value: dc.dc_value,
  success: dc.success_type.toUpperCase(),
});

const resolveDamage = async damage => {
  const damageTypes = await DamageTypeModel.find({
    index: { $in: damage.filter(d => d.damage_type).map(d => d.damage_type.index) },
  }).lean();

  return damage.map(async d => {
    const newDamage = {
      ...d,
    };

    if (d.damage_type) {
      newDamage.damage_type = damageTypes.find(dt => dt.index === d.damage_type.index);
    }

    if (d.dc) {
      newDamage.dc = await resolveDc(d.dc);
    }

    if (newDamage.from) {
      newDamage.from.options = await resolveDamage(newDamage.from.options);
    }

    return newDamage;
  });
};

const resolveUsage = usage => {
  const resolvedUsage = { ...usage, type: usage.type.toUpperCase().replace(/\s+/g, '_') };
  if (usage.rest_types) resolvedUsage.rest_types = usage.rest_types.map(rt => rt.toUpperCase());

  return resolvedUsage;
};

const Monster = {
  condition_immunities: async monster =>
    await ConditionModel.find({
      index: { $in: monster.condition_immunities.map(ci => ci.index) },
    }).lean(),
  forms: async monster =>
    monster.forms
      ? await MonsterModel.find({ index: { $in: monster.forms.map(f => f.index) } }).lean()
      : null,
  legendary_actions: async monster => {
    const { legendary_actions } = monster;
    if (!legendary_actions) return null;

    const resolvedLegendaryActions = [];
    for (const legendaryAction of legendary_actions) {
      const resolvedLegendaryAction = { ...legendaryAction };
      const { dc, damage } = legendaryAction;

      if (dc) resolvedLegendaryAction.dc = await resolveDc(dc);

      if (damage) resolvedLegendaryAction.damage = await resolveDamage(damage);

      resolvedLegendaryActions.push(resolvedLegendaryAction);
    }

    return resolvedLegendaryActions;
  },
  proficiencies: async monster => {
    const profs = await ProficiencyModel.find({
      index: { $in: monster.proficiencies.map(p => p.proficiency.index) },
    }).lean();

    return monster.proficiencies.map(async p => ({
      ...p,
      proficiency: profs.find(prof => prof.index === p.proficiency.index),
    }));
  },
  reactions: async monster =>
    monster.reactions
      ? monster.reactions.map(async r => {
          const resolvedReaction = { ...r };
          if (r.dc) resolvedReaction.dc = resolveDc(r.dc);
          return resolvedReaction;
        })
      : null,
  size: monster => monster.size.toUpperCase(),
  special_abilities: async monster => {
    const { special_abilities } = monster;
    if (!special_abilities) return null;

    const resolvedSpecialAbilities = [];
    for (const specialAbility of special_abilities) {
      const resolvedSpecialAbility = { ...specialAbility };
      const { dc, damage, usage, spellcasting } = specialAbility;

      if (dc) resolvedSpecialAbility.dc = await resolveDc(dc);

      if (damage) resolvedSpecialAbility.damage = await resolveDamage(damage);

      if (usage) {
        resolvedSpecialAbility.usage = resolveUsage(usage);
      }

      if (spellcasting) {
        const resolvedSpellcasting = { ...spellcasting };

        if (spellcasting.slots)
          resolvedSpellcasting.slots = levelObjectToArray(spellcasting.slots, 'slots');

        const spells = await SpellModel.find({
          url: { $in: spellcasting.spells.map(s => s.url) },
        }).lean();
        resolvedSpellcasting.spells = spellcasting.spells.map(async s => {
          const spell = { spell: spells.find(sp => sp.url === s.url) };
          if (s.usage) spell.usage = resolveUsage(s.usage);
          return spell;
        });

        resolvedSpecialAbility.spellcasting = resolvedSpellcasting;
      }

      resolvedSpecialAbilities.push(resolvedSpecialAbility);
    }

    return resolvedSpecialAbilities;
  },
  subtype: monster => (monster.subtype ? monster.subtype.toUpperCase().replace(' ', '_') : null),
  type: monster => {
    if (monster.type.includes('swarm')) {
      return 'SWARM';
    } else {
      return monster.type.toUpperCase();
    }
  },
  actions: async monster => {
    const { actions } = monster;
    if (!actions) {
      return null;
    }

    const actionsToReturn = [];

    for (const action of actions) {
      const actionToAdd = { ...action };
      if (action.attacks) {
        actionToAdd.attacks = action.attacks.map(async attack => {
          const attackToReturn = { name: attack.name, dc: await resolveDc(attack.dc) };
          if (attack.damage) {
            attackToReturn.damage = await resolveDamage(attack.damage);
          }

          return attackToReturn;
        });
      }

      if (action.damage) {
        actionToAdd.damage = await resolveDamage(action.damage);
      }

      if (action.dc) {
        actionToAdd.dc = await resolveDc(action.dc);
      }

      if (action.options) {
        actionToAdd.options = {
          ...action.options,
          from: {
            ...action.options.from,
            options: action.options.from.options.map(async option => {
              const newOption = { ...option, dc: await resolveDc(option.dc) };

              if (option.damage) {
                newOption.damage = await resolveDamage(option.damage);
              }

              return newOption;
            }),
          },
        };
      }

      if (action.usage) {
        actionToAdd.usage = resolveUsage(action.usage);
      }

      actionsToReturn.push(actionToAdd);
    }

    return actionsToReturn;
  },
};

module.exports = Monster;
