import { ObjectType, Field } from 'type-graphql'
import { GraphQLOption } from '../optionUnion' // Adjusted import path

@ObjectType({ description: 'Option set containing an array of specific options.' })
export class OptionsArrayOptionSetObject {
  @Field(() => String)
  readonly option_set_type = 'options_array' as const

  @Field(() => [GraphQLOption], { description: 'The list of options in this set.' })
  options!: Array<typeof GraphQLOption>
}
