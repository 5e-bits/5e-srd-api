const composeMongoose = require('graphql-compose-mongoose').composeMongoose;
const schemaComposer = require('graphql-compose').schemaComposer;

const AbilityScore = require('../models/abilityScore');
const Condition = require('../models/condition');
const DamageType = require('../models/damageType');
const EquipmentCategory = require('../models/equipmentCategory');

const customizationOptions = {}; // left it empty for simplicity, described below
const AbilityScoreTC = composeMongoose(AbilityScore, customizationOptions);
const ConditionTC = composeMongoose(Condition, customizationOptions);
const DamageTypeTC = composeMongoose(DamageType, customizationOptions);
const EquipmentCategoryTC = composeMongoose(EquipmentCategory, customizationOptions);

schemaComposer.Query.addFields({
  abilityScore: AbilityScoreTC.mongooseResolvers.findOne(),
  abilityScores: AbilityScoreTC.mongooseResolvers.findMany(),
  condition: ConditionTC.mongooseResolvers.findOne(),
  conditions: ConditionTC.mongooseResolvers.findMany(),
  damageType: DamageTypeTC.mongooseResolvers.findOne(),
  damageTypes: DamageTypeTC.mongooseResolvers.findMany(),
  equipmentCategories: EquipmentCategoryTC.mongooseResolvers.findMany(),
  equipmentCategory: EquipmentCategoryTC.mongooseResolvers.findOne(),
});

const graphqlSchema = schemaComposer.buildSchema();
module.exports = graphqlSchema;
