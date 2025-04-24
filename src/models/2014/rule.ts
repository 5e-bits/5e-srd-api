import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { APIReference } from '@/models/2014/common'
import { srdModelOptions } from '@/util/modelOptions'
import { ObjectType, Field } from 'type-graphql'
import { RuleSection } from './ruleSection'

@ObjectType({ description: 'Represents a top-level game rule (e.g., Adventuring, Combat).' })
@srdModelOptions('2014-rules')
export class Rule {
  @Field(() => String, { description: 'A description of the rule.' })
  @prop({ required: true, index: true, type: () => String })
  public desc!: string

  @Field(() => String, { description: 'Unique identifier for the rule (e.g., adventuring).' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'Name of the rule.' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => [RuleSection], {
    description: 'Subsections detailing specific aspects of this rule.'
  })
  @prop({ type: () => [APIReference], index: true, default: [] })
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
