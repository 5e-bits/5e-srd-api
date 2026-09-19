import { Field, Int, ObjectType } from 'type-graphql'

import { AbilityScore } from '@/models/2014/abilityScore'
import { Language } from '@/models/2014/language'
import { Proficiency } from '@/models/2014/proficiency'

import { ProficiencyChoiceItem } from './unions'

// --- Language Choice Types ---
@ObjectType({ description: 'Represents a reference to a language within a choice option set.' })
export class LanguageChoiceOption {
  @Field(() => String, { description: 'The type of this option (e.g., "reference").' })
  option_type!: string

  @Field(() => Language, { description: 'The resolved Language object.' })
  item!: Language
}

@ObjectType({ description: 'Represents a set of language options for a choice.' })
export class LanguageChoiceOptionSet {
  @Field(() => String, {
    description: 'The type of the option set (e.g., resource_list, options_array).'
  })
  option_set_type!: string

  @Field(() => [LanguageChoiceOption], {
    description: 'The list of language options available.'
  })
  options!: LanguageChoiceOption[]
}

@ObjectType({ description: 'Represents a choice from a list of languages.' })
export class LanguageChoice {
  @Field(() => Int, { description: 'The number of languages to choose from this list.' })
  choose!: number

  @Field(() => String, { description: 'The type of choice (e.g., languages).' })
  type!: string

  @Field(() => LanguageChoiceOptionSet, { description: 'The set of language options available.' })
  from!: LanguageChoiceOptionSet
}

// --- Proficiency Choice Types ---
@ObjectType({
  description:
    'Represents a reference to a Proficiency or nested ProficiencyChoice within a choice option set.'
})
export class ProficiencyChoiceOption {
  @Field(() => String, { description: 'The type of this option (e.g., "reference", "choice").' })
  option_type!: string

  @Field(() => ProficiencyChoiceItem, {
    description: 'The resolved Proficiency object or nested ProficiencyChoice.'
  })
  item!: Proficiency | ProficiencyChoice
}

@ObjectType({ description: 'Represents a set of Proficiency options for a choice.' })
export class ProficiencyChoiceOptionSet {
  @Field(() => String, {
    description: 'The type of the option set (e.g., resource_list, options_array).'
  })
  option_set_type!: string

  @Field(() => [ProficiencyChoiceOption], {
    description: 'The list of Proficiency options available.'
  })
  options!: ProficiencyChoiceOption[]
}

@ObjectType({
  description: 'Represents a choice from a list of Proficiencies or nested ProficiencyChoices.'
})
export class ProficiencyChoice {
  @Field(() => Int, { description: 'The number of Proficiencies to choose from this list.' })
  choose!: number

  @Field(() => String, { description: 'The type of choice (e.g., proficiencies).' })
  type!: string

  @Field(() => ProficiencyChoiceOptionSet, {
    description: 'The set of Proficiency options available.'
  })
  from!: ProficiencyChoiceOptionSet

  @Field(() => String, { nullable: true, description: 'Description of the choice.' })
  desc?: string
}

// --- Prerequisite Choice Types ---
@ObjectType({ description: 'A single prerequisite option' })
export class PrerequisiteChoiceOption {
  @Field(() => String, { description: 'The type of option.' })
  option_type!: string

  @Field(() => AbilityScore, { description: 'The ability score required.' })
  ability_score!: AbilityScore

  @Field(() => Int, { description: 'The minimum score required.' })
  minimum_score!: number
}

@ObjectType({ description: 'A set of prerequisite options to choose from' })
export class PrerequisiteChoiceOptionSet {
  @Field(() => String, { description: 'The type of option set.' })
  option_set_type!: string

  @Field(() => [PrerequisiteChoiceOption], { description: 'The available options.' })
  options!: PrerequisiteChoiceOption[]
}

@ObjectType({ description: 'A choice of prerequisites for multi-classing' })
export class PrerequisiteChoice {
  @Field(() => Int, { description: 'Number of prerequisites to choose.' })
  choose!: number

  @Field(() => String, { description: 'Type of prerequisites to choose from.' })
  type!: string

  @Field(() => PrerequisiteChoiceOptionSet, { description: 'The options to choose from.' })
  from!: PrerequisiteChoiceOptionSet

  @Field(() => String, { nullable: true, description: 'Description of the prerequisite choice.' })
  desc?: string
}

// --- Ability Score Bonus Choice Types ---
@ObjectType({ description: 'A single ability score bonus option' })
export class AbilityScoreBonusChoiceOption {
  @Field(() => String, { description: 'The type of option.' })
  option_type!: string

  @Field(() => AbilityScore, { description: 'The ability score to increase.' })
  ability_score!: AbilityScore

  @Field(() => Int, { description: 'The amount to increase the ability score by.' })
  bonus!: number
}

@ObjectType({ description: 'A set of ability score bonus options to choose from' })
export class AbilityScoreBonusChoiceOptionSet {
  @Field(() => String, { description: 'The type of option set.' })
  option_set_type!: string

  @Field(() => [AbilityScoreBonusChoiceOption], { description: 'The available options.' })
  options!: AbilityScoreBonusChoiceOption[]
}

@ObjectType({ description: 'A choice of ability score bonuses for a race' })
export class AbilityScoreBonusChoice {
  @Field(() => Int, { description: 'Number of ability score bonuses to choose.' })
  choose!: number

  @Field(() => String, { description: 'Type of ability score bonuses to choose from.' })
  type!: string

  @Field(() => AbilityScoreBonusChoiceOptionSet, { description: 'The options to choose from.' })
  from!: AbilityScoreBonusChoiceOptionSet

  @Field(() => String, {
    nullable: true,
    description: 'Description of the ability score bonus choice.'
  })
  desc?: string
}
