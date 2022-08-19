import AbilityScoreModel from '../../models/abilityScore/index.js';
import ClassModel from '../../models/class/index.js';
import DamageTypeModel from '../../models/damageType/index.js';
import MagicSchoolModel from '../../models/magicSchool/index.js';
import SubclassModel from '../../models/subclass/index.js';
import {
  coalesceFilters,
  levelObjectToArray,
  resolveAreaOfEffect,
  resolveContainsStringFilter,
} from './common.js';

const Spell = {
  attack_type: spell => (spell.attack_type ? spell.attack_type.toUpperCase() : null),
  area_of_effect: spell =>
    spell.area_of_effect ? resolveAreaOfEffect(spell.area_of_effect) : null,
  classes: async (spell, args) => {
    const filters = [{ index: { $in: spell.classes.map(c => c.index) } }];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    return await ClassModel.find(coalesceFilters(filters)).lean();
  },
  subclasses: async (spell, args) => {
    const filters = [{ index: { $in: spell.subclasses.map(s => s.index) } }];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    return await SubclassModel.find(coalesceFilters(filters)).lean();
  },
  damage: async spell => {
    if (!spell.damage) return null;
    const spellDamage = {};
    if (spell.damage.damage_type)
      spellDamage.damage_type = await DamageTypeModel.findOne({
        index: spell.damage.damage_type.index,
      }).lean();
    if (spell.damage.damage_at_slot_level)
      spellDamage.damage_at_slot_level = levelObjectToArray(
        spell.damage.damage_at_slot_level,
        'damage'
      );
    if (spell.damage.damage_at_character_level)
      spellDamage.damage_at_character_level = levelObjectToArray(
        spell.damage.damage_at_character_level,
        'damage'
      );

    return spellDamage;
  },
  dc: async spell =>
    spell.dc
      ? {
          ...spell.dc,
          type: await AbilityScoreModel.findOne({ index: spell.dc.dc_type.index }).lean(),
          success: spell.dc.dc_success.toUpperCase(),
        }
      : null,
  heal_at_slot_level: spell =>
    spell.heal_at_slot_level ? levelObjectToArray(spell.heal_at_slot_level, 'healing') : null,
  school: async spell => await MagicSchoolModel.findOne({ index: spell.school.index }).lean(),
};

export default Spell;
