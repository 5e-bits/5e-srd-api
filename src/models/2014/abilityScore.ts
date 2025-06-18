import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { srdModelOptions } from '@/util/modelOptions'

import { Skill } from './skill'
import { field, T } from '@/util/fieldDectorator'

@ObjectType({
  description:
    'An ability score representing a fundamental character attribute (e.g., Strength, Dexterity).'
})
@srdModelOptions('2014-ability-scores')
export class AbilityScore {
  @field({
    description: 'A description of the ability score and its applications.',
    type: T.String
  })
  public desc!: string[]

  @field({
    description: 'The full name of the ability score (e.g., Strength).',
    type: T.String
  })
  public full_name!: string

  @field({
    description: 'The unique identifier for this ability score (e.g., str).',
    type: T.String
  })
  public index!: string

  @field({
    description: 'The abbreviated name of the ability score (e.g., STR).',
    type: T.String
  })
  public name!: string

  @field({
    description: 'Skills associated with this ability score.',
    type: T.RefList(Skill)
  })
  public skills!: APIReference[]

  @field({
    description: 'The canonical path of this resource in the REST API.',
    type: T.String
  })
  public url!: string

  @field({ description: 'Timestamp of the last update.', type: T.String })
  public updated_at!: string
}

export type AbilityScoreDocument = DocumentType<AbilityScore>
const AbilityScoreModel = getModelForClass(AbilityScore)

export default AbilityScoreModel
