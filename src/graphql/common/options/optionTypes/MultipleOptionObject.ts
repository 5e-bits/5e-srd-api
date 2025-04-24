import { ObjectType, Field } from 'type-graphql'
import { GraphQLOption } from '../optionUnion' // Adjusted import path

@ObjectType({ description: 'Option containing multiple nested options.' })
export class MultipleOptionObject {
  @Field(() => String)
  readonly option_type = 'MultipleOption' as const

  @Field(() => [GraphQLOption])
  items!: Array<typeof GraphQLOption>
}
