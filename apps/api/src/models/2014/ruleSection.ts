import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, ObjectType } from 'type-graphql'

import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({ description: 'Represents a named section of the SRD rules document.' })
@srdModelOptions('2014-rule-sections')
export class RuleSection {
  @Field(() => String, { description: 'A description of the rule section.' })
  @prop({ required: true, index: true, type: () => String })
  public desc!: string

  @Field(() => String, {
    description: 'The unique identifier for this rule section (e.g., ability-checks).'
  })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'The name of the rule section (e.g., Ability Checks).' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type RuleSectionDocument = DocumentType<RuleSection>
const RuleSectionModel = getModelForClass(RuleSection)

export default RuleSectionModel
