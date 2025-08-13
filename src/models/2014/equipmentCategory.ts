import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { field, T } from '@/util/fieldDectorator'
import { srdModelOptions } from '@/util/modelOptions'

import { Equipment } from './equipment'

@ObjectType({
  description: 'A category for grouping equipment (e.g., Weapon, Armor, Adventuring Gear).'
})
@srdModelOptions('2014-equipment-categories')
export class EquipmentCategory {
  // Handled by EquipmentCategoryResolver
  @field(() => T.RefList(Equipment), { skipResolver: true })
  public equipment!: APIReference[]

  @field(() => T.String, { description: 'The unique identifier for this category (e.g., weapon).' })
  public index!: string

  @field(() => T.String, { description: 'The name of the category (e.g., Weapon).' })
  public name!: string

  @field(() => T.String, { description: 'The canonical path of this resource in the REST API.' })
  public url!: string

  @field(() => T.String, { description: 'Timestamp of the last update.' })
  public updated_at!: string
}

export type EquipmentCategoryDocument = DocumentType<EquipmentCategory>
const EquipmentCategoryModel = getModelForClass(EquipmentCategory)

export default EquipmentCategoryModel
