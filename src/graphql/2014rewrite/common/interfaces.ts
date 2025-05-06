import { InterfaceType, Field, ID, Float } from 'type-graphql'
import { Cost } from '@/models/2014/equipment'

@InterfaceType({
  description: 'Common fields shared by all types of equipment and magic items.'
  // Resolve type function needed later if union uses this interface
  // resolveType: value => { ... }
})
export abstract class IEquipment {
  @Field(() => ID, { description: 'The unique identifier for this equipment.' })
  index!: string // ID often maps to index

  @Field(() => String, { description: 'The name of the equipment.' })
  name!: string

  @Field(() => Cost, { description: 'Cost of the equipment in coinage.' })
  cost!: Cost

  @Field(() => Float, { nullable: true, description: 'Weight of the equipment in pounds.' })
  weight?: number

  @Field(() => [String], { nullable: true, description: 'Description of the equipment.' })
  desc?: string[]
}
