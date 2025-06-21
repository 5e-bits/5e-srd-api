import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { field, T } from '@/util/fieldDectorator'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({ description: 'Represents a named section of the SRD rules document.' })
@srdModelOptions('2014-rule-sections')
export class RuleSection {
  @field(() => T.String, { description: 'A description of the rule section.' })
  public desc!: string

  @field(() => T.String, {
    description: 'The unique identifier for this rule section (e.g., ability-checks).'
  })
  public index!: string

  @field(() => T.String, { description: 'The name of the rule section (e.g., Ability Checks).' })
  public name!: string

  @field(() => T.String, { description: 'The canonical path of this resource in the REST API.' })
  public url!: string

  @field(() => T.String, { description: 'Timestamp of the last update.' })
  public updated_at!: string
}

export type RuleSectionDocument = DocumentType<RuleSection>
const RuleSectionModel = getModelForClass(RuleSection)

export default RuleSectionModel
