import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'

import { APIReference } from '@/models/2014/common/apiReference'
import { srdModelOptions } from '@/util/modelOptions'

@srdModelOptions('2024-ability-scores')
export class AbilityScore2024 {
  @prop({ required: true, index: true, type: () => [String] })
  public description!: string[]

  @prop({ required: true, index: true, type: () => String })
  public full_name!: string

  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @prop({ type: () => [APIReference] })
  public skills!: APIReference[]

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type AbilityScoreDocument = DocumentType<AbilityScore2024>
const AbilityScoreModel = getModelForClass(AbilityScore2024)

export default AbilityScoreModel
