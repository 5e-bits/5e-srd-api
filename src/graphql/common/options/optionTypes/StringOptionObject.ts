import { ObjectType, Field } from 'type-graphql'

@ObjectType({ description: 'Option representing a simple string.' })
export class StringOptionObject {
  @Field(() => String)
  readonly option_type = 'StringOption' as const

  @Field(() => String)
  string!: string
}
