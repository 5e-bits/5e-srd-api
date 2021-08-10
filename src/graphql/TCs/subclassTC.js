const composeMongoose = require('graphql-compose-mongoose').composeMongoose;
const Subclass = require('../../models/subclass');
const ClassTC = require('./classTC');

const SubclassTC = composeMongoose(Subclass);

SubclassTC.addRelation('class', {
    resolver: () => ClassTC.mongooseResolvers.findOne({}),
    prepareArgs: {
        filter: source => ({
            index: source.class.index
        })
    },
    projection: { class: true }
});

module.exports = SubclassTC;