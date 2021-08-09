const composeMongoose = require('graphql-compose-mongoose').composeMongoose;
const Level = require('../../models/level');

const LevelTC = composeMongoose(Level);

module.exports = LevelTC;