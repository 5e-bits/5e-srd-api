import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

import { AbilityScore2024 } from './abilityScore'

@ObjectType({
  description: 'A skill representing proficiency in a specific task (e.g., Athletics, Stealth).'
})
@srdModelOptions('2024-skills')
export class Skill2024 {
  @field(T.Ref(() => AbilityScore2024), {
    description: 'The ability score associated with this skill.',
    required: true
  })
  public ability_score!: APIReference

  @field(T.String, { description: 'A description of the skill.', required: true, index: true })
  public description!: string

  @field(T.String, {
    description: 'The unique identifier for this skill (e.g., athletics).',
    required: true,
    index: true
  })
  public index!: string

  @field(T.String, {
    description: 'The name of the skill (e.g., Athletics).',
    required: true,
    index: true
  })
  public name!: string

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.String, { description: 'Timestamp of the last update.', required: true, index: true })
  public updated_at!: string
}

export type SkillDocument = DocumentType<Skill2024>
const SkillModel = getModelForClass(Skill2024)

export default SkillModel
