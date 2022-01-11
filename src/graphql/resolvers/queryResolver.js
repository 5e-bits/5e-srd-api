const AbilityScore = require('../../models/abilityScore');
const Alignment = require('../../models/alignment');
const Background = require('../../models/background');
const Class = require('../../models/class');
const Condition = require('../../models/condition');
const DamageType = require('../../models/damageType');
const Equipment = require('../../models/equipment');
const EquipmentCategory = require('../../models/equipmentCategory');
const Feat = require('../../models/feat');
const Feature = require('../../models/feature');
const Language = require('../../models/language');
const Level = require('../../models/level');
const MagicItem = require('../../models/magicItem');
const MagicSchool = require('../../models/magicSchool');
const Monster = require('../../models/monster');
const Proficiency = require('../../models/proficiency');
const Race = require('../../models/race');
const Rule = require('../../models/rule');
const RuleSection = require('../../models/ruleSection');
const Skill = require('../../models/skill');
const Spell = require('../../models/spell');
const Subclass = require('../../models/subclass');
const Subrace = require('../../models/subrace');
const Trait = require('../../models/trait');
const WeaponProperty = require('../../models/weaponProperty');

const Query = {
  async abilityScore(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await AbilityScore.findOne(filter).lean();
  },
  async abilityScores() {
    return await AbilityScore.find().lean();
  },
  async alignment(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Alignment.findOne(filter).lean();
  },
  async alignments() {
    return await Alignment.find().lean();
  },
  async background(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Background.findOne(filter).lean();
  },
  async backgrounds() {
    return await Background.find().lean();
  },
  async class(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Class.findOne(filter).lean();
  },
  async classes(query, args) {
    let filter = {};
    if (args.hit_die) {
      filter = { hit_die: { $in: args.hit_die } };
    }
    return await Class.find(filter).lean();
  },
  async condition(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Condition.findOne(filter).lean();
  },
  async conditions() {
    return Condition.find().lean();
  },
  async damageType(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await DamageType.findOne(filter).lean();
  },
  async damageTypes() {
    return await DamageType.find().lean();
  },
  async equipment(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Equipment.findOne(filter).lean();
  },
  async equipments(query, args) {
    let filter = {};
    if (args.equipment_category) {
      filter = { 'equipment_category.index': { $in: args.equipment_category } };
    }

    return await Equipment.find(filter).lean();
  },
  async equipmentCategory(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await EquipmentCategory.findOne(filter).lean();
  },
  async equipmentCategories() {
    return await EquipmentCategory.find().lean();
  },
  async feat(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Feat.findOne(filter).lean();
  },
  async feats() {
    return await Feat.find().lean();
  },
  async feature(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Feature.findOne(filter).lean();
  },
  async features() {
    return await Feature.find().lean();
  },
  async language(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Language.findOne(filter).lean();
  },
  async languages() {
    return await Language.find().lean();
  },
  async level(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Level.findOne(filter).lean();
  },
  async levels() {
    return await Level.find().lean();
  },
  async magicItem(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await MagicItem.findOne(filter).lean();
  },
  async magicItems() {
    return await MagicItem.find().lean();
  },
  async magicSchool(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await MagicSchool.findOne(filter).lean();
  },
  async magicSchools() {
    return await MagicSchool.find().lean();
  },
  async monster(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Monster.findOne(filter).lean();
  },
  async monsters() {
    return await Monster.find().lean();
  },
  async proficiency(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Proficiency.findOne(filter).lean();
  },
  async proficiencies() {
    return await Proficiency.find().lean();
  },
  async race(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Race.findOne(filter).lean();
  },
  async races() {
    return await Race.find().lean();
  },
  async rule(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Rule.findOne(filter).lean();
  },
  async rules() {
    return await Rule.find().lean();
  },
  async ruleSection(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await RuleSection.findOne(filter).lean();
  },
  async ruleSections() {
    return await RuleSection.find().lean();
  },
  async skill(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Skill.findOne(filter).lean();
  },
  async skills(query, args) {
    let filter = {};
    if (args.ability_score) {
      filter = { 'ability_score.index': { $in: args.ability_score } };
    }

    return await Skill.find(filter).lean();
  },
  async spell(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Spell.findOne(filter).lean();
  },
  async spells(query, args) {
    const filters = [];
    if (args.school) {
      const filter = { 'school.index': { $in: args.school } };
      filters.push(filter);
    }

    if (args.level) {
      const filter = { level: { $in: args.level } };
      filters.push(filter);
    }

    if (args.class) {
      const filter = { classes: { $elemMatch: { index: { $in: args.class } } } };
      filters.push(filter);
    }

    if (args.subclass) {
      const filter = { subclasses: { $elemMatch: { index: { $in: args.subclass } } } };
      filters.push(filter);
    }

    let filter = {};
    if (filters.length === 1) {
      filter = filters[0];
    }
    if (filters.length > 1) {
      filter = {
        $and: filters,
      };
    }

    return await Spell.find(filter).lean();
  },
  async subclass(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Subclass.findOne(filter).lean();
  },
  async subclasses() {
    return await Subclass.find().lean();
  },
  async subrace(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Subrace.findOne(filter).lean();
  },
  async subraces() {
    return await Subrace.find().lean();
  },
  async trait(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Trait.findOne(filter).lean();
  },
  async traits() {
    return await Trait.find().lean();
  },
  async weaponProperty() {
    return await WeaponProperty.findOne().lean();
  },
  async weaponProperties(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await WeaponProperty.find(filter).lean();
  },
};

module.exports = Query;
