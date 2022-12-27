import { levelObjectToArray, resolveChoice, resolveDc } from './common.js';

import ConditionModel from '../../models/condition/index.js';
import DamageTypeModel from '../../models/damageType/index.js';
import MonsterModel from '../../models/monster/index.js';
import ProficiencyModel from '../../models/proficiency/index.js';
import SpellModel from '../../models/spell/index.js';
import EquipmentModel from '../../models/equipment/index.js';

import {
  Monster,
  ActionUsage,
  SpecialAbilityUsage,
  ArmorClassNatural,
  ArmorClassSpell,
  ArmorClassArmor,
  ArmorClassCondition,
} from '../../models/monster/types';
import { DamageType } from '../../models/damageType/types';
import { Damage } from '../../models/common/types';

const resolveUsage = (usage: ActionUsage | SpecialAbilityUsage) => {
  const resolvedUsage: Record<string, any> = {
    ...usage,
    type: usage.type.toUpperCase().replace(/\s+/g, '_'),
  };
  if ('rest_types' in usage)
    resolvedUsage.rest_types = usage.rest_types?.map(rt => rt.toUpperCase());

  return resolvedUsage;
};

type ResolvedDamage = {
  damage_dice: string;
  damage_type?: DamageType | undefined;
};

const resolveDamage = async (damage: Damage[]) => {
  const damageTypes = await DamageTypeModel.find({
    index: { $in: damage.filter(d => d.damage_type).map(d => d.damage_type.index) },
  }).lean();

  return damage.map(async d => {
    const newDamage: ResolvedDamage = {
      damage_dice: d.damage_dice,
    };

    if (d.damage_type) {
      newDamage.damage_type = damageTypes.find(dt => dt.index === d.damage_type.index);
    }

    return newDamage;
  });
};

const Monster = {
  condition_immunities: async (monster: Monster) =>
    await ConditionModel.find({
      index: { $in: monster.condition_immunities.map(ci => ci.index) },
    }).lean(),
  forms: async (monster: Monster) =>
    monster.forms
      ? await MonsterModel.find({ index: { $in: monster.forms.map(f => f.index) } }).lean()
      : null,
  legendary_actions: async (monster: Monster) => {
    const { legendary_actions } = monster;
    if (!legendary_actions) return null;

    const resolvedLegendaryActions = [];
    for (const legendaryAction of legendary_actions) {
      const resolvedLegendaryAction: Record<string, any> = { ...legendaryAction };
      const { dc, damage } = legendaryAction;

      if (dc) resolvedLegendaryAction.dc = await resolveDc(dc);

      if (damage) resolvedLegendaryAction.damage = await resolveDamage(damage);

      resolvedLegendaryActions.push(resolvedLegendaryAction);
    }

    return resolvedLegendaryActions;
  },
  proficiencies: async (monster: Monster) => {
    const profs = await ProficiencyModel.find({
      index: { $in: monster.proficiencies.map(p => p.proficiency.index) },
    }).lean();

    return monster.proficiencies.map(async p => ({
      ...p,
      proficiency: profs.find(prof => prof.index === p.proficiency.index),
    }));
  },
  reactions: async (monster: Monster) =>
    monster.reactions
      ? monster.reactions.map(async r => {
          const resolvedReaction: Record<string, any> = { ...r };
          if (r.dc) resolvedReaction.dc = resolveDc(r.dc);
          return resolvedReaction;
        })
      : null,
  size: (monster: Monster) => monster.size.toUpperCase(),
  special_abilities: async (monster: Monster) => {
    const { special_abilities } = monster;
    if (!special_abilities) return null;

    const resolvedSpecialAbilities = [];
    for (const specialAbility of special_abilities) {
      const resolvedSpecialAbility: Record<string, any> = { ...specialAbility };
      const { dc, damage, usage, spellcasting } = specialAbility;

      if (dc) resolvedSpecialAbility.dc = await resolveDc(dc);

      if (damage) resolvedSpecialAbility.damage = await resolveDamage(damage);

      if (usage) {
        resolvedSpecialAbility.usage = resolveUsage(usage);
      }

      if (spellcasting) {
        const resolvedSpellcasting: Record<string, any> = { ...spellcasting };

        if (spellcasting.slots)
          resolvedSpellcasting.slots = levelObjectToArray(spellcasting.slots, 'slots');

        const spells = await SpellModel.find({
          url: { $in: spellcasting.spells.map(s => s.url) },
        }).lean();
        resolvedSpellcasting.spells = spellcasting.spells.map(async s => {
          const spell: Record<string, any> = { spell: spells.find(sp => sp.url === s.url) };
          if (s.usage) spell.usage = resolveUsage(s.usage);
          return spell;
        });

        resolvedSpecialAbility.spellcasting = resolvedSpellcasting;
      }

      resolvedSpecialAbilities.push(resolvedSpecialAbility);
    }

    return resolvedSpecialAbilities;
  },
  subtype: (monster: Monster) =>
    monster.subtype ? monster.subtype.toUpperCase().replace(/\s+/g, '_') : null,
  type: (monster: Monster) => {
    if (monster.type.includes('swarm')) {
      return 'SWARM';
    } else {
      return monster.type.toUpperCase();
    }
  },
  actions: async (monster: Monster) => {
    const { actions } = monster;
    if (!actions) {
      return null;
    }

    const actionsToReturn = [];

    for (const action of actions) {
      const actionToAdd: Record<string, any> = { ...action };

      if (action.damage) {
        actionToAdd.damage = await resolveDamage(action.damage);
      }

      if (action.dc) {
        actionToAdd.dc = await resolveDc(action.dc);
      }

      if (action.options && 'options' in action.options.from) {
        actionToAdd.options = resolveChoice(action.options, {
          options: action.options.from.options.map(async option => {
            if (option.option_type === 'breath') {
              const newOption: Record<string, any> = { ...option, dc: await resolveDc(option.dc) };

              if (option.damage) {
                newOption.damage = await resolveDamage(option.damage);
              }

              return newOption;
            }
          }),
        });
      }

      if (action.usage) {
        actionToAdd.usage = resolveUsage(action.usage);
      }

      actionsToReturn.push(actionToAdd);
    }

    return actionsToReturn;
  },
  armor_class: async (monster: Monster) => {
    const { armor_class } = monster;

    const armorClassToReturn = [];

    for (const ac of armor_class) {
      const acTorReturn: any = {
        type: ac.type.toUpperCase(),
        value: ac.value,
        desc: (ac as ArmorClassNatural).desc,
      };

      if ((ac as ArmorClassSpell).spell) {
        const spell = await SpellModel.findOne({
          index: (ac as ArmorClassSpell).spell.index,
        }).lean();

        acTorReturn.spell = spell;
      }

      if ((ac as ArmorClassArmor).armor) {
        const armor = await EquipmentModel.find({
          index: { $in: (ac as ArmorClassArmor).armor.map(a => a.index) },
        }).lean();

        acTorReturn.armor = armor;
      }

      if ((ac as ArmorClassCondition).condition) {
        const condition = await ConditionModel.findOne({
          index: (ac as ArmorClassCondition).condition.index,
        }).lean();

        acTorReturn.condition = condition;
      }

      armorClassToReturn.push(acTorReturn);
    }

    return armorClassToReturn;
  },
};

export default Monster;
