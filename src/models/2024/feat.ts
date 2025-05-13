import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { APIReference } from '@/models/2024/common'
import { srdModelOptions } from '@/util/modelOptions'

export class Prerequisite2024 {
  @prop({ type: () => APIReference })
  public ability_score!: APIReference

  @prop({ required: true, index: true, type: () => Number })
  public minimum_score!: number
}

@srdModelOptions('2024-feats')
export class Feat2024 {
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @prop({ type: () => [Prerequisite2024] })
  public prerequisites!: Prerequisite2024[]

  @prop({ required: true, index: true, type: () => [String] })
  public desc!: string[]

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type FeatDocument = DocumentType<Feat2024>
const FeatModel = getModelForClass(Feat2024)

export default FeatModel
