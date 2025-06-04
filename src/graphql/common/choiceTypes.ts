import { Field, Int, ObjectType } from 'type-graphql'

// --- Generic String Choice Types ---
@ObjectType({
  description: 'Represents a single string option within a choice (e.g., a flaw, a bond).'
})
export class StringChoiceOption {
  @Field(() => String, { description: 'The text content of the string option.' })
  string!: string

  @Field(() => String, { description: 'The type of the string option.' })
  option_type!: string
}

@ObjectType({ description: 'Represents a set of string options.' })
export class StringChoiceOptionSet {
  @Field(() => String, { description: 'The type of the string option set.' })
  option_set_type!: string

  @Field(() => [StringChoiceOption], { description: 'The list of string options available.' })
  options!: StringChoiceOption[]
}

@ObjectType({ description: 'Represents a choice from a list of string options.' })
export class StringChoice {
  @Field(() => Int, { description: 'The number of options to choose from this list.' })
  choose!: number

  @Field(() => String, { description: 'The type or category of the choice.' })
  type!: string

  @Field(() => StringChoiceOptionSet, { description: 'The set of string options available.' })
  from!: StringChoiceOptionSet
}
