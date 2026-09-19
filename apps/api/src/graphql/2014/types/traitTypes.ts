import { Field, Int, ObjectType } from 'type-graphql'

import { Spell } from '@/models/2014/spell'
import { Trait } from '@/models/2014/trait'

@ObjectType({ description: 'Represents a reference to a Trait within a choice option set.' })
export class TraitChoiceOption {
  @Field(() => String, { description: 'The type of this option (e.g., "reference").' })
  option_type!: string

  @Field(() => Trait, {
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

  @Field(() => Spell, {
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
