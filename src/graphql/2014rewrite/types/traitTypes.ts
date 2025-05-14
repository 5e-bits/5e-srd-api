import { ObjectType, Field, Int } from 'type-graphql'
import { customRequire } from '../utils/helpers'
import type { Trait } from '@/models/2014/trait'
import type { Spell } from '@/models/2014/spell'
import type { Proficiency } from '@/models/2014/proficiency'

@ObjectType({ description: 'Represents a reference to a Trait within a choice option set.' })
export class TraitChoiceOption {
  @Field(() => String, { description: 'The type of this option (e.g., "reference").' })
  option_type!: string

  @Field(() => customRequire('../../../models/2014/trait').Trait, {
    description: 'The resolved Trait object.'
  })
  item!: Trait
}

@ObjectType({ description: 'Represents a set of Trait options for a choice.' })
export class TraitChoiceOptionSet {
  @Field(() => String, {
    description: 'The type of the option set (e.g., resource_list, options_array).'
  })
  option_set_type!: string

  @Field(() => [TraitChoiceOption], { description: 'The list of Trait options available.' })
  options!: TraitChoiceOption[]
}

@ObjectType({ description: 'Represents a choice from a list of Traits.' })
export class TraitChoice {
  @Field(() => Int, { description: 'The number of Traits to choose from this list.' })
  choose!: number

  @Field(() => String, { description: 'The type of choice (e.g., subtraits).' })
  type!: string

  @Field(() => TraitChoiceOptionSet, { description: 'The set of Trait options available.' })
  from!: TraitChoiceOptionSet
}

@ObjectType({ description: 'Represents a reference to a Spell within a choice option set.' })
export class SpellChoiceOption {
  @Field(() => String, { description: 'The type of this option (e.g., "reference").' })
  option_type!: string

  @Field(() => customRequire('../../../models/2014/spell').Spell, {
    description: 'The resolved Spell object.'
  })
  item!: Spell
}

@ObjectType({ description: 'Represents a set of Spell options for a choice.' })
export class SpellChoiceOptionSet {
  @Field(() => String, {
    description: 'The type of the option set (e.g., resource_list, options_array).'
  })
  option_set_type!: string

  @Field(() => [SpellChoiceOption], { description: 'The list of Spell options available.' })
  options!: SpellChoiceOption[]
}

@ObjectType({ description: 'Represents a choice from a list of Spells.' })
export class SpellChoice {
  @Field(() => Int, { description: 'The number of Spells to choose from this list.' })
  choose!: number

  @Field(() => String, { description: 'The type of choice (e.g., spells).' })
  type!: string

  @Field(() => SpellChoiceOptionSet, { description: 'The set of Spell options available.' })
  from!: SpellChoiceOptionSet
}

@ObjectType({ description: 'Represents a reference to a Proficiency within a choice option set.' })
export class ProficiencyChoiceOption {
  @Field(() => String, { description: 'The type of this option (e.g., "reference").' })
  option_type!: string

  @Field(() => customRequire('../../../models/2014/proficiency').Proficiency, {
    description: 'The resolved Proficiency object.'
  })
  item!: Proficiency
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

@ObjectType({ description: 'Represents a choice from a list of Proficiencies.' })
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
