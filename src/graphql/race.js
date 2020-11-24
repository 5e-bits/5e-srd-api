const Race = require('../models/race');

const typeDef = ``;

const resolvers = {
  Query: {
    race: async (_, { query }) => {
      return await Race.findOne(query).exec();
    },
    races: async (_, { query, sortBy }) => {
      return await Race.find(query)
        .sort(sortBy)
        .exec();
    }
  }
};

module.exports = {
  typeDef,
  resolvers
};
