import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { srdModelOptions } from '@/util/modelOptions'

@srdModelOptions('2014-rule-sections')
export class RuleSection {
  @prop({ required: true, index: true, type: () => String })
  public desc!: string

  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type RuleSectionDocument = DocumentType<RuleSection>
const RuleSectionModel = getModelForClass(RuleSection)

export default RuleSectionModel
