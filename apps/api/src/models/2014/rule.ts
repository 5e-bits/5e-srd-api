import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({ description: 'A specific rule from the SRD.' })
@srdModelOptions('2014-rules')
export class Rule {
  @field(T.String, {
    description: 'Text under the rule heading, before any child rules.',
    index: true,
    gql: { nullable: true }
  })
  public desc?: string

  @field(T.String, {
    description: 'The unique identifier for this rule (e.g., adventuring).',
    required: true,
    index: true
  })
  public index!: string

  @field(T.String, {
    description: 'The name of the rule (e.g., Adventuring).',
    required: true,
    index: true
  })
  public name!: string

  @field(T.Ref(() => Rule), {
    description: 'The rule this rule is nested under.',
    index: true,
    gql: { nullable: true }
  })
  public parent?: APIReference

  @field(T.RefList(() => Rule), {
    description: 'Rules nested under this rule, in order.',
    index: true,
    gql: { nullable: true }
  })
  public children?: APIReference[]

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.String, { description: 'Timestamp of the last update.', required: true, index: true })
  public updated_at!: string
}

export type RuleDocument = DocumentType<Rule>
const RuleModel = getModelForClass(Rule)

export default RuleModel
