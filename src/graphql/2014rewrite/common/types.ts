import { ObjectType, Field, Int } from 'type-graphql'

// Define a generic key-value type for level-based maps
@ObjectType({ description: 'A key-value pair representing a value at a specific level.' })
export class LevelValue {
  @Field(() => Int, { description: 'The level.' })
  level!: number

  @Field(() => String, { description: 'The value associated with the level.' })
  value!: string
}
