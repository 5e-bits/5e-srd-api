import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { APIReference } from './common'
import { srdModelOptions } from '@/util/modelOptions'

@srdModelOptions('2014-ability-scores')
export class AbilityScore {
  @prop({ required: true, index: true, type: () => [String] })
  public desc!: string[]

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

export type AbilityScoreDocument = DocumentType<AbilityScore>
const AbilityScoreModel = getModelForClass(AbilityScore)

export default AbilityScoreModel
