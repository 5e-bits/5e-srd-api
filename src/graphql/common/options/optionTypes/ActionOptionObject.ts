import { ObjectType, Field } from 'type-graphql'

@ObjectType({ description: 'Option representing a specific action.' })
export class ActionOptionObject {
  @Field(() => String)
  readonly option_type = 'ActionOption' as const

  @Field(() => String)
  action_name!: string

  @Field(() => String)
  count!: string | number

  @Field(() => String)
  type!: 'melee' | 'ranged' | 'ability' | 'magic'

  @Field(() => String, { nullable: true })
  notes?: string
}
