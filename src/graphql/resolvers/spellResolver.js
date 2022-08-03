import AbilityScoreModel from '../../models/abilityScore/index.js';
import ClassModel from '../../models/class/index.js';
import DamageTypeModel from '../../models/damageType/index.js';
import MagicSchoolModel from '../../models/magicSchool/index.js';
import SubclassModel from '../../models/subclass/index.js';
import { levelObjectToArray } from './common.js';

const Spell = {
  attack_type: spell => (spell.attack_type ? spell.attack_type.toUpperCase() : null),
  area_of_effect: spell =>
    spell.area_of_effect
      ? { type: spell.area_of_effect.type.toUpperCase(), size: spell.area_of_effect.size }
      : null,
  casting_time: spell => {
    const { casting_time } = spell;

    switch (casting_time) {
      case '1 action':
        return 'ACTION';
      case '1 minute':
        return 'MINUTE';
      case '1 hour':
        return 'HOUR';
      case '1 bonus action':
        return 'BONUS_ACTION';
      case '10 minutes':
        return 'MINUTES_10';
      case '24 hours':
        return 'DAY';
      case '1 reaction':
        return 'REACTION';
    }
  },
  classes: async spell =>
    await ClassModel.find({ index: { $in: spell.classes.map(c => c.index) } }).lean(),
  subclasses: async spell =>
    await SubclassModel.find({ index: { $in: spell.subclasses.map(s => s.index) } }).lean(),
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
