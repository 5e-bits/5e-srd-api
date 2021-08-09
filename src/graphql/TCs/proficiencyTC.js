const composeMongoose = require('graphql-compose-mongoose').composeMongoose;
const Proficiency = require('../../models/proficiency');

const ProficiencyTC = composeMongoose(Proficiency);

module.exports = ProficiencyTC;