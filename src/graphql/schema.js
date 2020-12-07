const composeMongoose = require('graphql-compose-mongoose').composeMongoose;
const schemaComposer = require('graphql-compose').schemaComposer;

const AbilityScore = require('../models/abilityScore');
const Condition = require('../models/condition');
const DamageType = require('../models/damageType');
const EquipmentCategory = require('../models/equipmentCategory');
const Feature = require('../models/feature');
const Language = require('../models/language');
const MagicItem = require('../models/magicItem');
const MagicSchool = require('../models/magicSchool');

const customizationOptions = {}; // left it empty for simplicity, described below
const AbilityScoreTC = composeMongoose(AbilityScore, customizationOptions);
const ConditionTC = composeMongoose(Condition, customizationOptions);
const DamageTypeTC = composeMongoose(DamageType, customizationOptions);
const EquipmentCategoryTC = composeMongoose(EquipmentCategory, customizationOptions);
const FeatureTC = composeMongoose(Feature, customizationOptions);
const LanguageTC = composeMongoose(Language, customizationOptions);
const MagicItemTC = composeMongoose(MagicItem, customizationOptions);
const MagicSchoolTC = composeMongoose(MagicSchool, customizationOptions);

schemaComposer.Query.addFields({
  abilityScore: AbilityScoreTC.mongooseResolvers.findOne(),
  abilityScores: AbilityScoreTC.mongooseResolvers.findMany(),
  condition: ConditionTC.mongooseResolvers.findOne(),
  conditions: ConditionTC.mongooseResolvers.findMany(),
  damageType: DamageTypeTC.mongooseResolvers.findOne(),
  damageTypes: DamageTypeTC.mongooseResolvers.findMany(),
  equipmentCategory: EquipmentCategoryTC.mongooseResolvers.findOne(),
  equipmentCategories: EquipmentCategoryTC.mongooseResolvers.findMany(),
  feature: FeatureTC.mongooseResolvers.findOne(),
  features: FeatureTC.mongooseResolvers.findMany(),
  language: LanguageTC.mongooseResolvers.findOne(),
  languages: LanguageTC.mongooseResolvers.findMany(),
  magicItem: MagicItemTC.mongooseResolvers.findOne(),
  magicItems: MagicItemTC.mongooseResolvers.findMany(),
  magicSchool: MagicSchoolTC.mongooseResolvers.findOne(),
  magicSchools: MagicSchoolTC.mongooseResolvers.findMany(),
});

const graphqlSchema = schemaComposer.buildSchema();
module.exports = graphqlSchema;
