const composeMongoose = require('graphql-compose-mongoose').composeMongoose;
const schemaComposer = require('graphql-compose').schemaComposer;

const AbilityScore = require('../models/abilityScore');

const customizationOptions = {}; // left it empty for simplicity, described below
const AbilityScoreTC = composeMongoose(AbilityScore, customizationOptions);

schemaComposer.Query.addFields({
  abilityScore: AbilityScoreTC.mongooseResolvers.findOne(),
  abilityScores: AbilityScoreTC.mongooseResolvers.findMany(),
});

const graphqlSchema = schemaComposer.buildSchema();
module.exports = graphqlSchema;
