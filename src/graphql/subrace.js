const Subrace = require('../models/subrace');

const typeDef = `
extend type Query {
  subrace(query: SubraceQueryInput): Subrace
  subraces(sortBy: SubraceSortByInput, query: SubraceQueryInput): [Subrace]!
}

type Subrace {
  ability_bonuses: [SubraceAbility_bonuse]
  desc: String
  index: String
  language_options: SubraceLanguage_option
  name: String
  race: SubraceRace
  racial_trait_options: SubraceRacial_trait_option
  racial_traits: [SubraceRacial_trait]
  starting_proficiencies: [SubraceStarting_proficiency]
  url: String
}

type SubraceAbility_bonuse {
  ability_score: SubraceAbility_bonuseAbility_score
  bonus: Int
}

type SubraceAbility_bonuseAbility_score {
  index: String
  name: String
  url: String
}

input SubraceAbility_bonuseAbility_scoreQueryInput {
  name_exists: Boolean
  index: String
  index_exists: Boolean
  name_nin: [String]
  index_gt: String
  index_nin: [String]
  name_ne: String
  index_lt: String
  url_ne: String
  url_nin: [String]
  index_in: [String]
  index_ne: String
  name: String
  url_gte: String
  url_lt: String
  AND: [SubraceAbility_bonuseAbility_scoreQueryInput!]
  name_gt: String
  index_gte: String
  OR: [SubraceAbility_bonuseAbility_scoreQueryInput!]
  name_lte: String
  name_lt: String
  name_gte: String
  index_lte: String
  url_gt: String
  url_lte: String
  url: String
  name_in: [String]
  url_in: [String]
  url_exists: Boolean
}

input SubraceAbility_bonuseQueryInput {
  bonus_exists: Boolean
  bonus_ne: Int
  bonus_gte: Int
  ability_score_exists: Boolean
  bonus_lte: Int
  bonus_nin: [Int]
  bonus_in: [Int]
  ability_score: SubraceAbility_bonuseAbility_scoreQueryInput
  AND: [SubraceAbility_bonuseQueryInput!]
  bonus: Int
  bonus_lt: Int
  OR: [SubraceAbility_bonuseQueryInput!]
  bonus_gt: Int
}

type SubraceLanguage_option {
  choose: Int
  from: [SubraceLanguage_optionFrom]
  type: String
}

type SubraceLanguage_optionFrom {
  index: String
  name: String
  url: String
}

input SubraceLanguage_optionFromQueryInput {
  index_nin: [String]
  name_gte: String
  url_gt: String
  index_gte: String
  index_in: [String]
  name_lte: String
  OR: [SubraceLanguage_optionFromQueryInput!]
  AND: [SubraceLanguage_optionFromQueryInput!]
  url_lte: String
  url_ne: String
  name_nin: [String]
  index_gt: String
  url_in: [String]
  name_ne: String
  name_lt: String
  url_exists: Boolean
  name_in: [String]
  url_lt: String
  name: String
  index: String
  url_gte: String
  index_ne: String
  url_nin: [String]
  url: String
  index_lte: String
  index_exists: Boolean
  index_lt: String
  name_exists: Boolean
  name_gt: String
}

input SubraceLanguage_optionQueryInput {
  type_exists: Boolean
  OR: [SubraceLanguage_optionQueryInput!]
  type_lt: String
  choose_exists: Boolean
  type_nin: [String]
  choose: Int
  type: String
  choose_gt: Int
  choose_lte: Int
  AND: [SubraceLanguage_optionQueryInput!]
  choose_in: [Int]
  choose_nin: [Int]
  type_ne: String
  from_exists: Boolean
  from_nin: [SubraceLanguage_optionFromQueryInput]
  choose_gte: Int
  type_lte: String
  choose_lt: Int
  type_gt: String
  type_gte: String
  type_in: [String]
  choose_ne: Int
  from: [SubraceLanguage_optionFromQueryInput]
  from_in: [SubraceLanguage_optionFromQueryInput]
}

input SubraceQueryInput {
  index_in: [String]
  index_nin: [String]
  desc: String
  desc_lte: String
  racial_traits_in: [SubraceRacial_traitQueryInput]
  name_ne: String
  url_gte: String
  index_lte: String
  racial_trait_options: SubraceRacial_trait_optionQueryInput
  language_options_exists: Boolean
  url_exists: Boolean
  AND: [SubraceQueryInput!]
  starting_proficiencies: [SubraceStarting_proficiencyQueryInput]
  desc_gt: String
  name_lte: String
  racial_trait_options_exists: Boolean
  desc_lt: String
  index: String
  index_exists: Boolean
  _id_exists: Boolean
  name_nin: [String]
  name_lt: String
  language_options: SubraceLanguage_optionQueryInput
  url_ne: String
  ability_bonuses: [SubraceAbility_bonuseQueryInput]
  starting_proficiencies_exists: Boolean
  desc_ne: String
  name_in: [String]
  starting_proficiencies_nin: [SubraceStarting_proficiencyQueryInput]
  index_gte: String
  starting_proficiencies_in: [SubraceStarting_proficiencyQueryInput]
  url_in: [String]
  name: String
  name_exists: Boolean
  url_gt: String
  name_gt: String
  desc_nin: [String]
  index_gt: String
  name_gte: String
  index_lt: String
  url_nin: [String]
  desc_in: [String]
  desc_exists: Boolean
  race_exists: Boolean
  race: SubraceRaceQueryInput
  racial_traits_nin: [SubraceRacial_traitQueryInput]
  OR: [SubraceQueryInput!]
  url_lt: String
  desc_gte: String
  url: String
  index_ne: String
  url_lte: String
  racial_traits: [SubraceRacial_traitQueryInput]
  racial_traits_exists: Boolean
  ability_bonuses_in: [SubraceAbility_bonuseQueryInput]
  ability_bonuses_nin: [SubraceAbility_bonuseQueryInput]
  ability_bonuses_exists: Boolean
}

type SubraceRace {
  index: String
  name: String
  url: String
}

input SubraceRaceQueryInput {
  index_lt: String
  name_in: [String]
  index_lte: String
  index: String
  url: String
  index_exists: Boolean
  name_nin: [String]
  index_in: [String]
  index_ne: String
  name_ne: String
  AND: [SubraceRaceQueryInput!]
  index_gt: String
  url_gte: String
  url_lt: String
  name_lte: String
  url_gt: String
  index_gte: String
  url_ne: String
  name_lt: String
  OR: [SubraceRaceQueryInput!]
  url_nin: [String]
  url_lte: String
  name_exists: Boolean
  url_exists: Boolean
  name: String
  url_in: [String]
  name_gt: String
  name_gte: String
  index_nin: [String]
}

type SubraceRacial_trait {
  index: String
  name: String
  url: String
}

type SubraceRacial_trait_option {
  choose: Int
  from: [SubraceRacial_trait_optionFrom]
  type: String
}

type SubraceRacial_trait_optionFrom {
  index: String
  name: String
  url: String
}

input SubraceRacial_trait_optionFromQueryInput {
  index_gt: String
  url_lte: String
  url_nin: [String]
  index_gte: String
  url_ne: String
  index_lte: String
  name_lt: String
  url_gte: String
  index_ne: String
  name_in: [String]
  name_nin: [String]
  name: String
  name_lte: String
  index: String
  index_nin: [String]
  url: String
  index_in: [String]
  url_gt: String
  url_exists: Boolean
  OR: [SubraceRacial_trait_optionFromQueryInput!]
  index_exists: Boolean
  name_exists: Boolean
  name_ne: String
  AND: [SubraceRacial_trait_optionFromQueryInput!]
  index_lt: String
  url_lt: String
  name_gte: String
  name_gt: String
  url_in: [String]
}

input SubraceRacial_trait_optionQueryInput {
  type_in: [String]
  choose_in: [Int]
  choose_gt: Int
  type_lte: String
  choose: Int
  choose_gte: Int
  from: [SubraceRacial_trait_optionFromQueryInput]
  type: String
  from_nin: [SubraceRacial_trait_optionFromQueryInput]
  type_nin: [String]
  type_exists: Boolean
  type_ne: String
  type_gte: String
  choose_lt: Int
  choose_exists: Boolean
  from_in: [SubraceRacial_trait_optionFromQueryInput]
  choose_nin: [Int]
  type_gt: String
  AND: [SubraceRacial_trait_optionQueryInput!]
  choose_lte: Int
  OR: [SubraceRacial_trait_optionQueryInput!]
  choose_ne: Int
  from_exists: Boolean
  type_lt: String
}

input SubraceRacial_traitQueryInput {
  index_lte: String
  name_in: [String]
  url_in: [String]
  name_lt: String
  url_lt: String
  index_exists: Boolean
  index_lt: String
  url_ne: String
  index_nin: [String]
  name_gt: String
  url_lte: String
  name: String
  name_lte: String
  AND: [SubraceRacial_traitQueryInput!]
  index_gt: String
  index_ne: String
  url_gte: String
  name_ne: String
  index: String
  url_exists: Boolean
  index_gte: String
  url_gt: String
  url_nin: [String]
  name_exists: Boolean
  name_nin: [String]
  url: String
  name_gte: String
  OR: [SubraceRacial_traitQueryInput!]
  index_in: [String]
}

enum SubraceSortByInput {
  _ID_DESC
  DESC_ASC
  NAME_DESC
  _ID_ASC
  DESC_DESC
  NAME_ASC
  URL_ASC
  URL_DESC
  INDEX_ASC
  INDEX_DESC
}

type SubraceStarting_proficiency {
  index: String
  name: String
  url: String
}

input SubraceStarting_proficiencyQueryInput {
  index_in: [String]
  index_lt: String
  url_gte: String
  url_lte: String
  url_nin: [String]
  name_exists: Boolean
  index_exists: Boolean
  name_lte: String
  index_lte: String
  AND: [SubraceStarting_proficiencyQueryInput!]
  name_gte: String
  url_lt: String
  index: String
  OR: [SubraceStarting_proficiencyQueryInput!]
  index_gte: String
  name_gt: String
  url: String
  url_in: [String]
  index_nin: [String]
  url_gt: String
  name_lt: String
  index_gt: String
  url_exists: Boolean
  url_ne: String
  name: String
  index_ne: String
  name_nin: [String]
  name_ne: String
  name_in: [String]
}
`;

const resolvers = {
  Query: {
    subrace: async (_, { query }) => {
      return await Subrace.findOne(query).exec();
    },
    subraces: async (_, { query, sortBy }) => {
      return await Subrace.find(query)
        .sort(sortBy)
        .exec();
    },
  },
};

module.exports = {
  typeDef,
  resolvers,
};
