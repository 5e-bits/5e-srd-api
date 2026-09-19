import { Field, Int, ObjectType } from 'type-graphql'

import { EquipmentOptionSet2024 } from './optionSet'

@ObjectType({ description: 'A top-level equipment choice for a 2024 background.' })
export class BackgroundEquipmentChoice2024 {
  @Field(() => String, { nullable: true, description: 'Description of the choice.' })
  desc?: string

  @Field(() => Int, { description: 'Number to choose.' })
  choose!: number

  @Field(() => String, { description: "The type of choice, e.g., 'equipment'." })
  type!: string

  @Field(() => EquipmentOptionSet2024, { description: 'The set of equipment options.' })
  from!: EquipmentOptionSet2024
}
