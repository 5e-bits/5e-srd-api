import { InterfaceType, Field } from 'type-graphql'
import { EquipmentCategory } from '@/models/2014/equipmentCategory' // Import for field type

@InterfaceType({ description: 'Base interface for all equipment and magic items.' })
export abstract class IEquipmentBase {
  @Field(() => String, { description: 'Unique identifier for the item.' })
  index!: string

  @Field(() => String, { description: 'Name of the item.' })
  name!: string

  @Field(() => [String], { description: 'Description of the item.' })
  desc!: string[]

  @Field(() => EquipmentCategory, { description: 'The category the item belongs to.' })
  equipment_category!: EquipmentCategory // Resolved from APIReference

  @Field(() => String, { description: 'Timestamp of the last update.' })
  updated_at!: string
}
