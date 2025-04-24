import { ObjectType, Field } from 'type-graphql'
import { APIReferenceObject } from '../../objects' // This path should now resolve via index.ts

@ObjectType({ description: 'Option set linked to an equipment category.' })
export class EquipmentCategoryOptionSetObject {
  @Field(() => String)
  readonly option_set_type = 'equipment_category' as const

  @Field(() => APIReferenceObject)
  equipment_category!: APIReferenceObject // Reference to EquipmentCategory
}
