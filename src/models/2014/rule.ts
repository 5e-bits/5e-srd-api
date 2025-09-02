import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { field, T } from '@/util/fieldDectorator'
import { srdModelOptions } from '@/util/modelOptions'

import { RuleSection } from './ruleSection'

@ObjectType({ description: 'A specific rule from the SRD.' })
@srdModelOptions('2014-rules')
export class Rule {
  @field(() => T.String, { description: 'A description of the rule.' })
  public desc!: string

  @field(() => T.String, {
    description: 'The unique identifier for this rule (e.g., adventuring).'
  })
  public index!: string

  @field(() => T.String, { description: 'The name of the rule (e.g., Adventuring).' })
  public name!: string

  @field(() => T.RefList(RuleSection), {
    description: 'Subsections clarifying or detailing this rule.'
  })
  public subsections!: APIReference[]

  @field(() => T.String, { description: 'The canonical path of this resource in the REST API.' })
  public url!: string

  @field(() => T.String, { description: 'Timestamp of the last update.' })
  public updated_at!: string
}

export type RuleDocument = DocumentType<Rule>
const RuleModel = getModelForClass(Rule)

export default RuleModel
