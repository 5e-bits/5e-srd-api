import { Field, Int, ObjectType } from 'type-graphql'

import { AbilityScore2024 } from '@/models/2024/abilityScore'
import { Proficiency2024 } from '@/models/2024/proficiency'

// --- Score Prerequisite Choice Types (for Feat2024.prerequisite_options) ---

@ObjectType({ description: 'A score prerequisite option within a feat prerequisite choice.' })
export class ScorePrerequisiteOption2024 {
  @Field(() => String, { description: 'The type of this option.' })
  option_type!: string

  @Field(() => AbilityScore2024, { description: 'The ability score required.' })
  ability_score!: AbilityScore2024

  @Field(() => Int, { description: 'The minimum score required.' })
  minimum_score!: number
}

@ObjectType({ description: 'The set of score prerequisite options for a feat.' })
export class ScorePrerequisiteOptionSet2024 {
  @Field(() => String, { description: 'The type of the option set.' })
  option_set_type!: string

  @Field(() => [ScorePrerequisiteOption2024], {
    description: 'The available prerequisite options.'
  })
  options!: ScorePrerequisiteOption2024[]
}

@ObjectType({ description: 'A prerequisite choice for a 2024 feat (ability score requirements).' })
export class ScorePrerequisiteChoice2024 {
  @Field(() => String, { nullable: true, description: 'Description of the prerequisite choice.' })
  desc?: string

  @Field(() => Int, { description: 'Number of options to choose.' })
  choose!: number

  @Field(() => String, { description: 'The type of choice.' })
  type!: string

  @Field(() => ScorePrerequisiteOptionSet2024, { description: 'The set of options.' })
  from!: ScorePrerequisiteOptionSet2024
}

// --- Proficiency Choice Types (for Background2024.proficiency_choices) ---

@ObjectType({ description: 'A reference to a 2024 proficiency within a choice option set.' })
export class Proficiency2024ChoiceOption {
  @Field(() => String, { description: 'The type of this option.' })
  option_type!: string

  @Field(() => Proficiency2024, { description: 'The resolved Proficiency2024 object.' })
  item!: Proficiency2024
}

@ObjectType({ description: 'The set of proficiency options for a background choice.' })
export class Proficiency2024ChoiceOptionSet {
  @Field(() => String, { description: 'The type of the option set.' })
  option_set_type!: string

  @Field(() => [Proficiency2024ChoiceOption], { description: 'The available proficiency options.' })
  options!: Proficiency2024ChoiceOption[]
}

@ObjectType({ description: 'A proficiency choice for a 2024 background.' })
export class Proficiency2024Choice {
  @Field(() => String, { nullable: true, description: 'Description of the choice.' })
  desc?: string

  @Field(() => Int, { description: 'Number of proficiencies to choose.' })
  choose!: number

  @Field(() => String, { description: 'The type of choice.' })
  type!: string

  @Field(() => Proficiency2024ChoiceOptionSet, { description: 'The set of proficiency options.' })
  from!: Proficiency2024ChoiceOptionSet
}
