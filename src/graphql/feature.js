const Feature = require('../models/feature');

const typeDef = `
type Feature {
  choice: FeatureChoice
  class: FeatureClass
  desc: [String]
  group: String
  index: String
  level: Int
  name: String
  prerequisites: [FeaturePrerequisite]
  reference: String
  subclass: FeatureSubclass
  url: String
}

type FeatureChoice {
  choose: Int
  from: [FeatureChoiceFrom]
  type: String
}

type FeatureChoiceFrom {
  index: String
  name: String
  url: String
}

input FeatureChoiceFromQueryInput {
  name_exists: Boolean
  url_nin: [String]
  index_ne: String
  url_lt: String
  name_in: [String]
  url_ne: String
  index_in: [String]
  index_lte: String
  index_nin: [String]
  url_gte: String
  url_in: [String]
  url_gt: String
  AND: [FeatureChoiceFromQueryInput!]
  name_nin: [String]
  name: String
  url_exists: Boolean
  index_gte: String
  index_exists: Boolean
  name_ne: String
  OR: [FeatureChoiceFromQueryInput!]
  name_gte: String
  url_lte: String
  url: String
  index_lt: String
  name_gt: String
  index: String
  index_gt: String
  name_lte: String
  name_lt: String
}

input FeatureChoiceQueryInput {
  choose_ne: Int
  from_exists: Boolean
  from_nin: [FeatureChoiceFromQueryInput]
  type_gt: String
  choose_nin: [Int]
  type_lte: String
  AND: [FeatureChoiceQueryInput!]
  from: [FeatureChoiceFromQueryInput]
  choose: Int
  choose_gte: Int
  choose_gt: Int
  OR: [FeatureChoiceQueryInput!]
  from_in: [FeatureChoiceFromQueryInput]
  type_lt: String
  type_nin: [String]
  choose_lte: Int
  choose_lt: Int
  choose_exists: Boolean
  type_ne: String
  type_gte: String
  choose_in: [Int]
  type_in: [String]
  type_exists: Boolean
  type: String
}

type FeatureClass {
  index: String
  name: String
  url: String
}

input FeatureClassQueryInput {
  AND: [FeatureClassQueryInput!]
  url_gt: String
  url_nin: [String]
  name_lt: String
  url: String
  index_in: [String]
  name: String
  name_nin: [String]
  url_lte: String
  index: String
  index_lte: String
  name_ne: String
  url_gte: String
  index_gte: String
  index_exists: Boolean
  index_gt: String
  name_lte: String
  name_in: [String]
  index_nin: [String]
  url_lt: String
  index_ne: String
  name_gt: String
  index_lt: String
  name_gte: String
  url_exists: Boolean
  name_exists: Boolean
  url_ne: String
  OR: [FeatureClassQueryInput!]
  url_in: [String]
}

type FeaturePrerequisite {
  level: Int
  type: String
}

input FeaturePrerequisiteQueryInput {
  level_lte: Int
  type_ne: String
  level_gt: Int
  level_gte: Int
  type_exists: Boolean
  type_nin: [String]
  type_lt: String
  type_lte: String
  AND: [FeaturePrerequisiteQueryInput!]
  type: String
  type_gt: String
  level: Int
  OR: [FeaturePrerequisiteQueryInput!]
  level_lt: Int
  type_gte: String
  level_exists: Boolean
  level_nin: [Int]
  type_in: [String]
  level_in: [Int]
  level_ne: Int
}

input FeatureQueryInput {
  desc_in: [String]
  desc: [String]
  group_ne: String
  reference_lte: String
  name_lt: String
  name_nin: [String]
  url_gt: String
  url_lte: String
  index_gte: String
  level_exists: Boolean
  prerequisites_exists: Boolean
  reference_ne: String
  group_gt: String
  class_exists: Boolean
  choice: FeatureChoiceQueryInput
  url: String
  url_ne: String
  name_lte: String
  level_gte: Int
  level_gt: Int
  class: FeatureClassQueryInput
  subclass_exists: Boolean
  url_nin: [String]
  url_lt: String
  index_gt: String
  url_in: [String]
  url_gte: String
  index_lte: String
  prerequisites_nin: [FeaturePrerequisiteQueryInput]
  index: String
  AND: [FeatureQueryInput!]
  _id_exists: Boolean
  level_ne: Int
  reference_gte: String
  group_lt: String
  index_in: [String]
  level_nin: [Int]
  reference_nin: [String]
  group_exists: Boolean
  group_nin: [String]
  prerequisites_in: [FeaturePrerequisiteQueryInput]
  OR: [FeatureQueryInput!]
  prerequisites: [FeaturePrerequisiteQueryInput]
  index_ne: String
  reference: String
  level_lt: Int
  name_exists: Boolean
  level_lte: Int
  reference_in: [String]
  name_ne: String
  desc_nin: [String]
  reference_lt: String
  subclass: FeatureSubclassQueryInput
  name_gt: String
  reference_exists: Boolean
  reference_gt: String
  name: String
  index_exists: Boolean
  index_nin: [String]
  name_in: [String]
  level: Int
  group_in: [String]
  desc_exists: Boolean
  level_in: [Int]
  index_lt: String
  group_gte: String
  group_lte: String
  choice_exists: Boolean
  name_gte: String
  group: String
  url_exists: Boolean
}

enum FeatureSortByInput {
  GROUP_ASC
  REFERENCE_ASC
  _ID_DESC
  LEVEL_ASC
  LEVEL_DESC
  _ID_ASC
  INDEX_ASC
  INDEX_DESC
  URL_ASC
  NAME_DESC
  URL_DESC
  GROUP_DESC
  REFERENCE_DESC
  NAME_ASC
}

type FeatureSubclass {
  index: String
  name: String
  url: String
}

input FeatureSubclassQueryInput {
  OR: [FeatureSubclassQueryInput!]
  url_ne: String
  url_in: [String]
  url_gte: String
  name_in: [String]
  name_exists: Boolean
  name_nin: [String]
  url: String
  url_lt: String
  index_in: [String]
  url_nin: [String]
  name_lte: String
  index_exists: Boolean
  index_gte: String
  AND: [FeatureSubclassQueryInput!]
  url_gt: String
  url_lte: String
  name_lt: String
  index_nin: [String]
  name_ne: String
  index: String
  index_lte: String
  name_gte: String
  name_gt: String
  index_gt: String
  index_ne: String
  index_lt: String
  url_exists: Boolean
  name: String
}
`;

const resolvers = {
  Query: {
    feature: async (_, { query }) => {
      return await Feature.findOne(query).exec();
    },
    features: async (_, { query, sortBy }) => {
      return await Feature.find(query)
        .sort(sortBy)
        .exec();
    }
  }
};

module.exports = {
  typeDef,
  resolvers
};
