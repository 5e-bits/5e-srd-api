import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { Skill2024 } from '@/models/2024/skill'
import { APIReference } from '@/models/common/apiReference'
import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({
  description:
    'An ability score representing a fundamental character attribute (e.g., Strength, Dexterity).'
})
@srdModelOptions('2024-ability-scores')
export class AbilityScore2024 {
  @field(T.String, {
    description: 'A description of the ability score and its applications.',
    required: true,
    index: true
  })
  public description!: string

  @field(T.String, {
    description: 'The full name of the ability score (e.g., Strength).',
    required: true,
    index: true
  })
  public full_name!: string

  @field(T.String, {
    description: 'The unique identifier for this ability score (e.g., str).',
    required: true,
    index: true
  })
  public index!: string

  @field(T.String, {
    description: 'The abbreviated name of the ability score (e.g., STR).',
    required: true,
    index: true
  })
  public name!: string

  @field(T.RefList(() => Skill2024), { description: 'Skills associated with this ability score.' })
  public skills!: APIReference[]

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.String, { description: 'Timestamp of the last update.', required: true, index: true })
  public updated_at!: string
}

export type AbilityScoreDocument = DocumentType<AbilityScore2024>
const AbilityScoreModel = getModelForClass(AbilityScore2024)

export default AbilityScoreModel
