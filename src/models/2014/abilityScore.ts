import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { field, T } from '@/util/fieldDectorator'
import { srdModelOptions } from '@/util/modelOptions'

import { Skill } from './skill'

@ObjectType({
  description:
    'An ability score representing a fundamental character attribute (e.g., Strength, Dexterity).'
})
@srdModelOptions('2014-ability-scores')
export class AbilityScore {
  @field(() => T.List(String), {
    description: 'A description of the ability score and its applications.'
  })
  public desc!: string[]

  @field(() => T.String, { description: 'The full name of the ability score (e.g., Strength).' })
  public full_name!: string

  @field(() => T.String, {
    description: 'The unique identifier for this ability score (e.g., str).'
  })
  public index!: string

  @field(() => T.String, { description: 'The abbreviated name of the ability score (e.g., STR).' })
  public name!: string

  @field(() => T.RefList(Skill), {
    description: 'Skills associated with this ability score.'
  })
  public skills!: APIReference[]

  @field(() => T.String, { description: 'The canonical path of this resource in the REST API.' })
  public url!: string

  @field(() => T.String, { description: 'Timestamp of the last update.' })
  public updated_at!: string
}

export type AbilityScoreDocument = DocumentType<AbilityScore>
const AbilityScoreModel = getModelForClass(AbilityScore)

export default AbilityScoreModel
