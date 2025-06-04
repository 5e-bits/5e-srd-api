import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({
  description: 'A category for grouping equipment (e.g., Weapon, Armor, Adventuring Gear).'
})
@srdModelOptions('2014-equipment-categories')
export class EquipmentCategory {
  // Handled by EquipmentCategoryResolver
  @prop({ type: () => [APIReference], index: true })
  public equipment!: APIReference[]

  @Field(() => String, { description: 'The unique identifier for this category (e.g., weapon).' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'The name of the category (e.g., Weapon).' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type EquipmentCategoryDocument = DocumentType<EquipmentCategory>
const EquipmentCategoryModel = getModelForClass(EquipmentCategory)

export default EquipmentCategoryModel
