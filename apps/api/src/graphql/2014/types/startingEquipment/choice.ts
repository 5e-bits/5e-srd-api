import { Field, Int, ObjectType } from 'type-graphql'

import { EquipmentCategorySet } from './common'
import { EquipmentOptionSet, StartingEquipmentFromUnion } from './optionSet'

@ObjectType({ description: 'Represents a choice for starting equipment.' })
export class StartingEquipmentChoice {
  @Field(() => Int, { description: 'The number of items or options to choose.' })
  choose!: number

  @Field(() => String, {
    nullable: true,
    description: 'A description of the choice presented to the user.'
  })
  desc?: string // desc can be optional based on some data models

  @Field(() => String, { description: "The type of choice, e.g., 'equipment'." })
  type!: string

  // This will use a forward reference to StartingEquipmentFromUnion defined in optionSet.ts
  @Field(() => StartingEquipmentFromUnion, {
    description: 'The set of options or category to choose from.'
  })
  from!: EquipmentCategorySet | EquipmentOptionSet
}
