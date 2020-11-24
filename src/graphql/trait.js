const Trait = require('../models/trait');

const typeDef = `
type Trait {
  desc: [String]
  index: String
  name: String
  proficiencies: [TraitProficiency]
  proficiency_choices: TraitProficiency_choice
  races: [TraitRace]
  subraces: [TraitSubrace]
  url: String
}

type TraitProficiency {
  index: String
  name: String
  url: String
}

type TraitProficiency_choice {
  choose: Int
  from: [TraitProficiency_choiceFrom]
  type: String
}

type TraitProficiency_choiceFrom {
  index: String
  name: String
  url: String
}

input TraitProficiency_choiceFromQueryInput {
  index_nin: [String]
  url_exists: Boolean
  url_ne: String
  url_nin: [String]
  name_nin: [String]
  index_lt: String
  url_lt: String
  index_lte: String
  name: String
  url_gt: String
  name_exists: Boolean
  name_lte: String
  name_gte: String
  url_in: [String]
  name_lt: String
  index_in: [String]
  name_ne: String
  name_in: [String]
  url_gte: String
  index_ne: String
  url_lte: String
  index_gt: String
  index: String
  OR: [TraitProficiency_choiceFromQueryInput!]
  name_gt: String
  index_exists: Boolean
  url: String
  AND: [TraitProficiency_choiceFromQueryInput!]
  index_gte: String
}

input TraitProficiency_choiceQueryInput {
  from: [TraitProficiency_choiceFromQueryInput]
  choose_gt: Int
  type: String
  OR: [TraitProficiency_choiceQueryInput!]
  AND: [TraitProficiency_choiceQueryInput!]
  choose_gte: Int
  from_nin: [TraitProficiency_choiceFromQueryInput]
  choose_ne: Int
  type_in: [String]
  type_ne: String
  choose: Int
  from_in: [TraitProficiency_choiceFromQueryInput]
  type_lte: String
  choose_in: [Int]
  choose_lte: Int
  type_exists: Boolean
  choose_lt: Int
  type_gt: String
  choose_nin: [Int]
  choose_exists: Boolean
  type_lt: String
  from_exists: Boolean
  type_nin: [String]
  type_gte: String
}

input TraitProficiencyQueryInput {
  url_in: [String]
  index_nin: [String]
  name: String
  name_ne: String
  AND: [TraitProficiencyQueryInput!]
  index_ne: String
  name_gte: String
  name_lte: String
  index: String
  index_exists: Boolean
  index_lt: String
  url_lte: String
  index_lte: String
  url_ne: String
  name_gt: String
  name_nin: [String]
  url_exists: Boolean
  index_gte: String
  OR: [TraitProficiencyQueryInput!]
  url: String
  url_nin: [String]
  name_lt: String
  name_in: [String]
  name_exists: Boolean
  url_lt: String
  url_gt: String
  url_gte: String
  index_in: [String]
  index_gt: String
}

input TraitQueryInput {
  name_nin: [String]
  index: String
  subraces_nin: [TraitSubraceQueryInput]
  _id_exists: Boolean
  proficiencies: [TraitProficiencyQueryInput]
  index_gt: String
  url_in: [String]
  index_ne: String
  url_lte: String
  subraces_in: [TraitSubraceQueryInput]
  url_exists: Boolean
  name_exists: Boolean
  races: [TraitRaceQueryInput]
  url_gt: String
  url_lt: String
  proficiency_choices_exists: Boolean
  name_lte: String
  proficiencies_in: [TraitProficiencyQueryInput]
  name_gt: String
  index_nin: [String]
  proficiencies_exists: Boolean
  desc_in: [String]
  races_exists: Boolean
  name_gte: String
  desc: [String]
  name_ne: String
  index_gte: String
  races_nin: [TraitRaceQueryInput]
  AND: [TraitQueryInput!]
  proficiency_choices: TraitProficiency_choiceQueryInput
  url_ne: String
  url_gte: String
  name_lt: String
  OR: [TraitQueryInput!]
  name_in: [String]
  races_in: [TraitRaceQueryInput]
  subraces: [TraitSubraceQueryInput]
  index_lt: String
  name: String
  desc_nin: [String]
  index_lte: String
  subraces_exists: Boolean
  url: String
  index_in: [String]
  index_exists: Boolean
  proficiencies_nin: [TraitProficiencyQueryInput]
  desc_exists: Boolean
  url_nin: [String]
}

type TraitRace {
  index: String
  name: String
  url: String
}

input TraitRaceQueryInput {
  name: String
  index_exists: Boolean
  url_in: [String]
  url_exists: Boolean
  index_lt: String
  name_lte: String
  index_in: [String]
  url_nin: [String]
  index_gt: String
  url_gte: String
  index_nin: [String]
  url_ne: String
  name_in: [String]
  name_gte: String
  name_exists: Boolean
  name_nin: [String]
  url: String
  index_ne: String
  name_ne: String
  url_lt: String
  OR: [TraitRaceQueryInput!]
  index: String
  url_lte: String
  name_gt: String
  index_gte: String
  AND: [TraitRaceQueryInput!]
  index_lte: String
  name_lt: String
  url_gt: String
}

enum TraitSortByInput {
  URL_DESC
  _ID_ASC
  _ID_DESC
  INDEX_ASC
  INDEX_DESC
  NAME_ASC
  NAME_DESC
  URL_ASC
}

type TraitSubrace {
  index: String
  name: String
  url: String
}

input TraitSubraceQueryInput {
  url_gte: String
  index_in: [String]
  index: String
  name_ne: String
  index_lt: String
  name: String
  index_lte: String
  index_gt: String
  url_in: [String]
  url_nin: [String]
  url_ne: String
  name_in: [String]
  url_exists: Boolean
  name_lt: String
  name_gt: String
  name_gte: String
  AND: [TraitSubraceQueryInput!]
  index_nin: [String]
  index_exists: Boolean
  url: String
  index_ne: String
  url_lt: String
  url_gt: String
  url_lte: String
  name_exists: Boolean
  name_nin: [String]
  name_lte: String
  OR: [TraitSubraceQueryInput!]
  index_gte: String
}
`;

const resolvers = {
  Query: {
    trait: async (_, { query }) => {
      return await Trait.findOne(query).exec();
    },
    traits: async (_, { query, sortBy }) => {
      return await Trait.find(query)
        .sort(sortBy)
        .exec();
    }
  }
};

module.exports = {
  typeDef,
  resolvers
};
