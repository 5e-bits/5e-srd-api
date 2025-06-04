import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { srdModelOptions } from '@/util/modelOptions'

import { RuleSection } from './ruleSection'

@ObjectType({ description: 'A specific rule from the SRD.' })
@srdModelOptions('2014-rules')
export class Rule {
  @Field(() => String, { description: 'A description of the rule.' })
  @prop({ required: true, index: true, type: () => String })
  public desc!: string

  @Field(() => String, { description: 'The unique identifier for this rule (e.g., adventuring).' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'The name of the rule (e.g., Adventuring).' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => [RuleSection], {
    description: 'Subsections clarifying or detailing this rule.'
  })
  @prop({ type: () => [APIReference], index: true })
  public subsections!: APIReference[]

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type RuleDocument = DocumentType<Rule>
const RuleModel = getModelForClass(Rule)

export default RuleModel
