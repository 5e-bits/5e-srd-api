const composeMongoose = require('graphql-compose-mongoose').composeMongoose;
const Spell = require('../../models/spell');

const SpellTC = composeMongoose(Spell);

module.exports = SpellTC;