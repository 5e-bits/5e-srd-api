const AbilityScore = require('../../models/abilityScore');
const Alignment = require('../../models/alignment');
const DamageType = require('../../models/damageType');
const Equipment = require('../../models/equipment');
const EquipmentCategory = require('../../models/equipmentCategory');
const Feat = require('../../models/feat');
const Language = require('../../models/language');
const MagicItem = require('../../models/magicItem');
const Skill = require('../../models/skill');
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
  async equipments() {
    return await Equipment.find().lean();
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
  async language(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Language.findOne(filter).lean();
  },
  async languages() {
    return await Language.find().lean();
  },
  async magicItem(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await MagicItem.findOne(filter).lean();
  },
  async magicItems() {
    return await MagicItem.find().lean();
  },
  async skill(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Skill.findOne(filter).lean();
  },
  async skills() {
    return await Skill.find().lean();
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
