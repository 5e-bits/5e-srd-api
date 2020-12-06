const Race = require('../models/race');

const typeDef = `
extend type Query {
  race(query: RaceQueryInput): Race
  races(query: RaceQueryInput, sortBy: RaceSortByInput): [Race]!
}

type Race {
  ability_bonus_options: RaceAbility_bonus_option
  ability_bonuses: [RaceAbility_bonuse]
  age: String
  alignment: String
  index: String
  language_desc: String
  language_options: RaceLanguage_option
  languages: [RaceLanguage]
  name: String
  size: String
  size_description: String
  speed: Int
  starting_proficiencies: [RaceStarting_proficiency]
  starting_proficiency_options: RaceStarting_proficiency_option
  subraces: [RaceSubrace]
  trait_options: RaceTrait_option
  traits: [RaceTrait]
  url: String
}

type RaceAbility_bonus_option {
  choose: Int
  from: [RaceAbility_bonus_optionFrom]
  type: String
}

type RaceAbility_bonus_optionFrom {
  ability_score: RaceAbility_bonus_optionFromAbility_score
  bonus: Int
}

type RaceAbility_bonus_optionFromAbility_score {
  index: String
  name: String
  url: String
}

input RaceAbility_bonus_optionFromAbility_scoreQueryInput {
  url_exists: Boolean
  url_nin: [String]
  url_lt: String
  index_in: [String]
  name: String
  index_lte: String
  index_gt: String
  name_exists: Boolean
  OR: [RaceAbility_bonus_optionFromAbility_scoreQueryInput!]
  name_in: [String]
  url: String
  name_gt: String
  name_gte: String
  url_lte: String
  index_ne: String
  name_ne: String
  index_nin: [String]
  AND: [RaceAbility_bonus_optionFromAbility_scoreQueryInput!]
  name_nin: [String]
  name_lt: String
  url_ne: String
  index_gte: String
  index: String
  index_exists: Boolean
  url_gte: String
  url_in: [String]
  name_lte: String
  url_gt: String
  index_lt: String
}

input RaceAbility_bonus_optionFromQueryInput {
  AND: [RaceAbility_bonus_optionFromQueryInput!]
  bonus_gte: Int
  ability_score: RaceAbility_bonus_optionFromAbility_scoreQueryInput
  bonus_in: [Int]
  bonus_gt: Int
  bonus_nin: [Int]
  bonus_ne: Int
  OR: [RaceAbility_bonus_optionFromQueryInput!]
  ability_score_exists: Boolean
  bonus_lt: Int
  bonus_lte: Int
  bonus: Int
  bonus_exists: Boolean
}

input RaceAbility_bonus_optionQueryInput {
  type_nin: [String]
  AND: [RaceAbility_bonus_optionQueryInput!]
  type_in: [String]
  choose_exists: Boolean
  type_gt: String
  choose_lt: Int
  choose: Int
  from_nin: [RaceAbility_bonus_optionFromQueryInput]
  type_lt: String
  choose_gte: Int
  from_in: [RaceAbility_bonus_optionFromQueryInput]
  type_exists: Boolean
  choose_ne: Int
  from: [RaceAbility_bonus_optionFromQueryInput]
  type_lte: String
  type: String
  type_ne: String
  choose_lte: Int
  OR: [RaceAbility_bonus_optionQueryInput!]
  choose_in: [Int]
  choose_gt: Int
  type_gte: String
  choose_nin: [Int]
  from_exists: Boolean
}

type RaceAbility_bonuse {
  ability_score: RaceAbility_bonuseAbility_score
  bonus: Int
}

type RaceAbility_bonuseAbility_score {
  index: String
  name: String
  url: String
}

input RaceAbility_bonuseAbility_scoreQueryInput {
  url: String
  OR: [RaceAbility_bonuseAbility_scoreQueryInput!]
  name_in: [String]
  name_exists: Boolean
  index_gt: String
  url_gt: String
  url_lte: String
  AND: [RaceAbility_bonuseAbility_scoreQueryInput!]
  name_lt: String
  url_lt: String
  index_gte: String
  url_in: [String]
  url_ne: String
  index_lt: String
  url_nin: [String]
  url_gte: String
  index: String
  name_nin: [String]
  index_nin: [String]
  name: String
  name_gt: String
  index_lte: String
  name_ne: String
  index_exists: Boolean
  index_ne: String
  url_exists: Boolean
  index_in: [String]
  name_gte: String
  name_lte: String
}

input RaceAbility_bonuseQueryInput {
  ability_score: RaceAbility_bonuseAbility_scoreQueryInput
  ability_score_exists: Boolean
  bonus: Int
  bonus_ne: Int
  bonus_gt: Int
  OR: [RaceAbility_bonuseQueryInput!]
  bonus_exists: Boolean
  bonus_lte: Int
  bonus_nin: [Int]
  bonus_gte: Int
  bonus_lt: Int
  bonus_in: [Int]
  AND: [RaceAbility_bonuseQueryInput!]
}

type RaceLanguage {
  index: String
  name: String
  url: String
}

type RaceLanguage_option {
  choose: Int
  from: [RaceLanguage_optionFrom]
  type: String
}

type RaceLanguage_optionFrom {
  index: String
  name: String
  url: String
}

input RaceLanguage_optionFromQueryInput {
  name_gte: String
  name_lt: String
  url_lte: String
  url_gte: String
  OR: [RaceLanguage_optionFromQueryInput!]
  index_in: [String]
  index_nin: [String]
  index_lt: String
  index_gte: String
  name_nin: [String]
  url_gt: String
  index: String
  name_ne: String
  url_ne: String
  index_ne: String
  name_lte: String
  name_in: [String]
  url_nin: [String]
  name_gt: String
  index_exists: Boolean
  url_in: [String]
  index_gt: String
  name_exists: Boolean
  url: String
  index_lte: String
  url_exists: Boolean
  name: String
  AND: [RaceLanguage_optionFromQueryInput!]
  url_lt: String
}

input RaceLanguage_optionQueryInput {
  type_lte: String
  type_nin: [String]
  AND: [RaceLanguage_optionQueryInput!]
  OR: [RaceLanguage_optionQueryInput!]
  choose_exists: Boolean
  type_gte: String
  type: String
  type_gt: String
  from_exists: Boolean
  type_lt: String
  choose_nin: [Int]
  type_ne: String
  choose_gte: Int
  choose_in: [Int]
  choose_gt: Int
  from: [RaceLanguage_optionFromQueryInput]
  type_in: [String]
  choose_ne: Int
  from_in: [RaceLanguage_optionFromQueryInput]
  type_exists: Boolean
  choose_lt: Int
  choose_lte: Int
  from_nin: [RaceLanguage_optionFromQueryInput]
  choose: Int
}

input RaceLanguageQueryInput {
  name_lt: String
  AND: [RaceLanguageQueryInput!]
  index_exists: Boolean
  OR: [RaceLanguageQueryInput!]
  index: String
  index_lte: String
  index_lt: String
  name_in: [String]
  name_gt: String
  url_ne: String
  url_gt: String
  index_gt: String
  index_ne: String
  url_gte: String
  name_exists: Boolean
  index_gte: String
  url: String
  name_lte: String
  url_in: [String]
  name: String
  name_gte: String
  url_exists: Boolean
  name_ne: String
  name_nin: [String]
  index_in: [String]
  url_lte: String
  url_nin: [String]
  index_nin: [String]
  url_lt: String
}

input RaceQueryInput {
  size_description_ne: String
  size_lte: String
  language_options: RaceLanguage_optionQueryInput
  size_description: String
  name_lt: String
  age_lte: String
  language_desc_lte: String
  traits_in: [RaceTraitQueryInput]
  language_desc: String
  size_description_exists: Boolean
  url_gt: String
  name_ne: String
  size_gt: String
  name_nin: [String]
  starting_proficiencies: [RaceStarting_proficiencyQueryInput]
  size_description_in: [String]
  alignment_lte: String
  ability_bonuses_in: [RaceAbility_bonuseQueryInput]
  age_exists: Boolean
  ability_bonus_options: RaceAbility_bonus_optionQueryInput
  speed_in: [Int]
  index_lt: String
  ability_bonus_options_exists: Boolean
  age_gte: String
  languages_nin: [RaceLanguageQueryInput]
  index_gt: String
  url_exists: Boolean
  alignment_gte: String
  index_ne: String
  starting_proficiencies_exists: Boolean
  languages_in: [RaceLanguageQueryInput]
  url_lt: String
  index_gte: String
  speed: Int
  starting_proficiencies_nin: [RaceStarting_proficiencyQueryInput]
  subraces_in: [RaceSubraceQueryInput]
  age_ne: String
  index_lte: String
  age_gt: String
  size_exists: Boolean
  url_ne: String
  size: String
  size_gte: String
  ability_bonuses: [RaceAbility_bonuseQueryInput]
  language_desc_in: [String]
  name_in: [String]
  traits: [RaceTraitQueryInput]
  url_nin: [String]
  alignment_nin: [String]
  starting_proficiency_options: RaceStarting_proficiency_optionQueryInput
  index_nin: [String]
  OR: [RaceQueryInput!]
  name_gte: String
  starting_proficiency_options_exists: Boolean
  age_nin: [String]
  size_description_lt: String
  language_options_exists: Boolean
  alignment: String
  alignment_exists: Boolean
  trait_options_exists: Boolean
  size_in: [String]
  trait_options: RaceTrait_optionQueryInput
  speed_exists: Boolean
  index_exists: Boolean
  speed_gte: Int
  url: String
  url_lte: String
  alignment_lt: String
  language_desc_gte: String
  starting_proficiencies_in: [RaceStarting_proficiencyQueryInput]
  language_desc_gt: String
  speed_gt: Int
  index_in: [String]
  url_in: [String]
  language_desc_lt: String
  url_gte: String
  alignment_in: [String]
  ability_bonuses_nin: [RaceAbility_bonuseQueryInput]
  speed_ne: Int
  size_description_gte: String
  age_in: [String]
  languages_exists: Boolean
  ability_bonuses_exists: Boolean
  size_description_lte: String
  name_exists: Boolean
  _id_exists: Boolean
  alignment_gt: String
  AND: [RaceQueryInput!]
  age: String
  size_description_gt: String
  size_nin: [String]
  languages: [RaceLanguageQueryInput]
  name: String
  index: String
  traits_nin: [RaceTraitQueryInput]
  size_description_nin: [String]
  size_lt: String
  size_ne: String
  language_desc_nin: [String]
  alignment_ne: String
  speed_lte: Int
  speed_nin: [Int]
  traits_exists: Boolean
  name_lte: String
  language_desc_exists: Boolean
  subraces: [RaceSubraceQueryInput]
  name_gt: String
  age_lt: String
  subraces_exists: Boolean
  subraces_nin: [RaceSubraceQueryInput]
  speed_lt: Int
  language_desc_ne: String
}

enum RaceSortByInput {
  SIZE_DESCRIPTION_DESC
  ALIGNMENT_ASC
  SIZE_DESC
  _ID_ASC
  NAME_ASC
  SIZE_DESCRIPTION_ASC
  SPEED_ASC
  SPEED_DESC
  SIZE_ASC
  URL_DESC
  NAME_DESC
  ALIGNMENT_DESC
  LANGUAGE_DESC_ASC
  LANGUAGE_DESC_DESC
  _ID_DESC
  AGE_ASC
  AGE_DESC
  URL_ASC
  INDEX_ASC
  INDEX_DESC
}

type RaceStarting_proficiency {
  index: String
  name: String
  url: String
}

type RaceStarting_proficiency_option {
  choose: Int
  from: [RaceStarting_proficiency_optionFrom]
  type: String
}

type RaceStarting_proficiency_optionFrom {
  index: String
  name: String
  url: String
}

input RaceStarting_proficiency_optionFromQueryInput {
  index_nin: [String]
  index_gte: String
  name_lt: String
  url: String
  index_lte: String
  OR: [RaceStarting_proficiency_optionFromQueryInput!]
  url_ne: String
  name: String
  url_lt: String
  index: String
  name_gt: String
  name_nin: [String]
  index_in: [String]
  name_lte: String
  AND: [RaceStarting_proficiency_optionFromQueryInput!]
  url_in: [String]
  url_gt: String
  index_lt: String
  name_ne: String
  index_gt: String
  url_nin: [String]
  index_ne: String
  name_exists: Boolean
  url_lte: String
  index_exists: Boolean
  url_gte: String
  name_gte: String
  url_exists: Boolean
  name_in: [String]
}

input RaceStarting_proficiency_optionQueryInput {
  type_exists: Boolean
  from_in: [RaceStarting_proficiency_optionFromQueryInput]
  choose_in: [Int]
  from_nin: [RaceStarting_proficiency_optionFromQueryInput]
  choose: Int
  choose_gte: Int
  type_in: [String]
  choose_lte: Int
  from_exists: Boolean
  type_lt: String
  choose_exists: Boolean
  choose_gt: Int
  type_gte: String
  type_nin: [String]
  AND: [RaceStarting_proficiency_optionQueryInput!]
  type_ne: String
  choose_ne: Int
  type_gt: String
  type: String
  choose_lt: Int
  from: [RaceStarting_proficiency_optionFromQueryInput]
  type_lte: String
  OR: [RaceStarting_proficiency_optionQueryInput!]
  choose_nin: [Int]
}

input RaceStarting_proficiencyQueryInput {
  url_gt: String
  url: String
  url_in: [String]
  index_exists: Boolean
  url_ne: String
  index_lt: String
  OR: [RaceStarting_proficiencyQueryInput!]
  name_in: [String]
  index: String
  index_lte: String
  AND: [RaceStarting_proficiencyQueryInput!]
  url_lte: String
  name_lt: String
  name_ne: String
  url_exists: Boolean
  name: String
  index_gte: String
  url_nin: [String]
  index_gt: String
  name_exists: Boolean
  name_lte: String
  name_gte: String
  index_in: [String]
  name_gt: String
  index_ne: String
  url_gte: String
  index_nin: [String]
  name_nin: [String]
  url_lt: String
}

type RaceSubrace {
  index: String
  name: String
  url: String
}

input RaceSubraceQueryInput {
  index_gt: String
  url_gte: String
  index_exists: Boolean
  name: String
  url_lt: String
  index: String
  url_ne: String
  url: String
  name_gt: String
  OR: [RaceSubraceQueryInput!]
  index_lt: String
  url_exists: Boolean
  name_exists: Boolean
  url_lte: String
  index_lte: String
  index_nin: [String]
  name_ne: String
  url_in: [String]
  AND: [RaceSubraceQueryInput!]
  url_gt: String
  index_gte: String
  name_gte: String
  name_in: [String]
  name_lt: String
  index_in: [String]
  url_nin: [String]
  index_ne: String
  name_nin: [String]
  name_lte: String
}

type RaceTrait {
  index: String
  name: String
  url: String
}

type RaceTrait_option {
  choose: Int
  from: [RaceTrait_optionFrom]
  type: String
}

type RaceTrait_optionFrom {
  index: String
  name: String
  url: String
}

input RaceTrait_optionFromQueryInput {
  url_gt: String
  name_lt: String
  index_gte: String
  url_nin: [String]
  index: String
  name_nin: [String]
  url_lt: String
  url: String
  name_exists: Boolean
  name_in: [String]
  index_exists: Boolean
  AND: [RaceTrait_optionFromQueryInput!]
  index_in: [String]
  name_gte: String
  url_lte: String
  OR: [RaceTrait_optionFromQueryInput!]
  name_gt: String
  name_lte: String
  url_gte: String
  index_ne: String
  url_in: [String]
  name_ne: String
  name: String
  index_lt: String
  index_lte: String
  url_exists: Boolean
  url_ne: String
  index_nin: [String]
  index_gt: String
}


input RaceTrait_optionQueryInput {
  choose_lt: Int
  AND: [RaceTrait_optionQueryInput!]
  type_gt: String
  choose_gte: Int
  choose_nin: [Int]
  choose_exists: Boolean
  type: String
  type_lt: String
  choose_in: [Int]
  from_exists: Boolean
  type_gte: String
  OR: [RaceTrait_optionQueryInput!]
  type_nin: [String]
  type_lte: String
  choose: Int
  choose_lte: Int
  type_ne: String
  from: [RaceTrait_optionFromQueryInput]
  type_exists: Boolean
  choose_ne: Int
  from_in: [RaceTrait_optionFromQueryInput]
  from_nin: [RaceTrait_optionFromQueryInput]
  type_in: [String]
  choose_gt: Int
}

input RaceTraitQueryInput {
  url_lt: String
  name: String
  name_gt: String
  index_gte: String
  url_exists: Boolean
  name_gte: String
  name_lte: String
  index_lt: String
  name_ne: String
  url_gte: String
  name_nin: [String]
  index_gt: String
  url_gt: String
  index_lte: String
  url: String
  index: String
  url_lte: String
  url_nin: [String]
  url_in: [String]
  index_ne: String
  name_in: [String]
  AND: [RaceTraitQueryInput!]
  index_nin: [String]
  OR: [RaceTraitQueryInput!]
  name_lt: String
  name_exists: Boolean
  index_exists: Boolean
  url_ne: String
  index_in: [String]
}
`;

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
