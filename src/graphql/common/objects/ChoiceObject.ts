import { ObjectType, Field, Int } from 'type-graphql'
import { GraphQLOptionSet } from '../options/optionSetUnion' // Forward reference to the OptionSet union

@ObjectType({ description: 'Represents a choice presented to the user.' })
export class ChoiceObject {
  @Field(() => String, { description: 'Description of the choice to be made.' })
  desc!: string

  @Field(() => Int, { description: 'The number of options to choose from the provided list.' })
  choose!: number

  @Field(() => String, { description: 'A description of the type of choice.' })
  type!: string

  @Field(() => GraphQLOptionSet, { description: 'The set of options available for this choice.' })
  from!: typeof GraphQLOptionSet // Use the union type
}
