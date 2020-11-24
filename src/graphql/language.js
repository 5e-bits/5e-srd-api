const Language = require('../models/language');

const typeDef = `type Language {
  desc: String
  index: String
  name: String
  script: String
  type: String
  typical_speakers: [String]
  url: String
}

input LanguageQueryInput {
  _id_exists: Boolean
  name_gt: String
  script_lte: String
  typical_speakers_exists: Boolean
  url_in: [String]
  name_exists: Boolean
  type: String
  url_lte: String
  type_gt: String
  name_nin: [String]
  name_ne: String
  AND: [LanguageQueryInput!]
  type_ne: String
  url_nin: [String]
  url_lt: String
  index_lt: String
  name_lt: String
  type_lte: String
  script_nin: [String]
  desc_ne: String
  desc_nin: [String]
  index_nin: [String]
  script: String
  script_exists: Boolean
  desc_lt: String
  index_exists: Boolean
  index_gt: String
  typical_speakers: [String]
  name: String
  name_lte: String
  type_lt: String
  index_lte: String
  index_ne: String
  typical_speakers_nin: [String]
  url_ne: String
  desc: String
  desc_gt: String
  url_gt: String
  script_gt: String
  index: String
  name_in: [String]
  type_gte: String
  name_gte: String
  url_exists: Boolean
  type_exists: Boolean
  index_gte: String
  type_nin: [String]
  index_in: [String]
  script_in: [String]
  desc_exists: Boolean
  url: String
  desc_gte: String
  desc_in: [String]
  desc_lte: String
  script_ne: String
  typical_speakers_in: [String]
  type_in: [String]
  OR: [LanguageQueryInput!]
  script_gte: String
  script_lt: String
  url_gte: String
}

enum LanguageSortByInput {
  NAME_DESC
  SCRIPT_DESC
  _ID_ASC
  INDEX_DESC
  SCRIPT_ASC
  URL_DESC
  DESC_ASC
  DESC_DESC
  NAME_ASC
  TYPE_DESC
  _ID_DESC
  INDEX_ASC
  TYPE_ASC
  URL_ASC
}
`;

const resolvers = {
  Query: {
    language: async (_, { query }) => {
      return await Language.findOne(query).exec();
    },
    languages: async (_, { query, sortBy }) => {
      return await Language.find(query)
        .sort(sortBy)
        .exec();
    }
  }
};

module.exports = {
  typeDef,
  resolvers
};
