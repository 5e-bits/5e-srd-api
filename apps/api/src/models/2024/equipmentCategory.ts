import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({
  description: 'A category for grouping equipment (e.g., Weapon, Armor, Adventuring Gear).'
})
@srdModelOptions('2024-equipment-categories')
export class EquipmentCategory2024 {
  // Handled by EquipmentCategoryResolver
  @field(T.List(() => APIReference), { index: true, gql: false })
  public equipment!: APIReference[]

  @field(T.String, {
    description: 'The unique identifier for this category (e.g., weapon).',
    required: true,
    index: true
  })
  public index!: string

  @field(T.String, {
    description: 'The name of the category (e.g., Weapon).',
    required: true,
    index: true
  })
  public name!: string

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.String, { description: 'Timestamp of the last update.', required: true, index: true })
  public updated_at!: string
}

export type EquipmentCategoryDocument = DocumentType<EquipmentCategory2024>
const EquipmentCategoryModel = getModelForClass(EquipmentCategory2024)

export default EquipmentCategoryModel
