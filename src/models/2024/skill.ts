import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'

import { APIReference } from '@/models/2014/common/apiReference'
import { srdModelOptions } from '@/util/modelOptions'

@srdModelOptions('2024-skills')
export class Skill2024 {
  @prop({ type: () => APIReference, required: true })
  public ability_score!: APIReference

  @prop({ required: true, index: true, type: () => [String] })
  public description!: string[]

  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type SkillDocument = DocumentType<Skill2024>
const SkillModel = getModelForClass(Skill2024)

export default SkillModel
