import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { APIReference } from '@/models/2014/common'
import { srdModelOptions } from '@/util/modelOptions'
import { ObjectType, Field } from 'type-graphql'

@ObjectType({ description: 'Categories of equipment (e.g., Adventuring Gear, Heavy Armor).' })
@srdModelOptions('2014-equipment-categories')
export class EquipmentCategory {
  @prop({ type: () => [APIReference], index: true, default: [] })
  public equipment!: APIReference[]

  @Field(() => String, { description: 'Unique identifier for the category (e.g., heavy-armor).' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'Name of the equipment category.' })
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
