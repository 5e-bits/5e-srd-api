const composeMongoose = require('graphql-compose-mongoose').composeMongoose;
const LevelTC = require('./levelTC');
const SpellTC = require('./spellTC');
const ProficiencyTC = require('./proficiencyTC');
const Class = require('../../models/class');

const ClassTC = composeMongoose(Class);

ClassTC.addRelation('class_levels', {
    resolver: () => LevelTC.mongooseResolvers.findMany({}),
    prepareArgs: {
      filter: source => ({
        class: {
          index: source.index
        }
      })
    },
    projection: { index: true }
});

ClassTC.addRelation('spells', {
    resolver: () => SpellTC.mongooseResolvers.findMany({}),
    prepareArgs: {
        filter: source => ({
            classes: [{ index: source.index }]
        })
    },
    projection: {index: true}
});

ClassTC.addRelation('proficiencies', {
    resolver: () => ProficiencyTC.mongooseResolvers.findMany({}),
    prepareArgs: {
      filter: source => ({
        classes: [{ index: source.index }]
    })},
    projection: { index: true }
});

module.exports = ClassTC;