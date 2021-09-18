const AbilityScore = require('../../models/abilityScore');
const Class = require('../../models/class');
const DamageType = require('../../models/damageType');
const MagicSchool = require('../../models/magicSchool');
const Subclass = require('../../models/subclass');
const { levelObjectToArray } = require('./common');

const Spell = {
  classes: async spell =>
    await Class.find({ index: { $in: spell.classes.map(c => c.index) } }).lean(),
  subclasses: async spell =>
    await Subclass.find({ index: { $in: spell.subclasses.map(s => s.index) } }).lean(),
  damage: async spell => {
    if (!spell.damage) return null;
    const spellDamage = {};
    if (spell.damage.damage_type)
      spellDamage.damage_type = await DamageType.findOne({
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
          type: await AbilityScore.findOne({ index: spell.dc.dc_type.index }).lean(),
          success: spell.dc.dc_success.toUpperCase(),
        }
      : null,
  heal_at_slot_level: spell =>
    spell.heal_at_slot_level ? levelObjectToArray(spell.heal_at_slot_level, 'healing') : null,
  school: async spell => await MagicSchool.findOne({ index: spell.school.index }).lean(),
};

module.exports = Spell;
