import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { APIReference } from '@/models/2014/common'
import { srdModelOptions } from '@/util/modelOptions'

@srdModelOptions('2014-equipment-categories')
export class EquipmentCategory {
  @prop({ type: () => [APIReference], index: true })
  public equipment!: APIReference[]

  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type EquipmentCategoryDocument = DocumentType<EquipmentCategory>
const EquipmentCategoryModel = getModelForClass(EquipmentCategory)

export default EquipmentCategoryModel
