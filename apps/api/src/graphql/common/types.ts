import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType({ description: 'A key-value pair representing a value at a specific level.' })
export class LevelValue {
  @Field(() => Int, { description: 'The level.' })
  level!: number

  @Field(() => String, { description: 'The value associated with the level.' })
  value!: string
}

@ObjectType({ description: 'Represents a count of spell slots for a specific level.' })
export class SpellSlotCount {
  @Field(() => Int, { description: 'The spell slot level.' })
  slot_level!: number

  @Field(() => Int, { description: 'The number of spell slots available for this level.' })
  count!: number
}
