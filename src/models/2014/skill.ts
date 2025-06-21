import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { field, T } from '@/util/fieldDectorator'
import { srdModelOptions } from '@/util/modelOptions'

import { AbilityScore } from './abilityScore'

@ObjectType({
  description: 'A skill representing proficiency in a specific task (e.g., Athletics, Stealth).'
})
@srdModelOptions('2014-skills')
export class Skill {
  @field(() => T.Ref(AbilityScore), {
    description: 'The ability score associated with this skill.'
  })
  public ability_score!: APIReference

  @field(() => T.List(String), { description: 'A description of the skill.' })
  public desc!: string[]

  @field(() => T.String, { description: 'The unique identifier for this skill (e.g., athletics).' })
  public index!: string

  @field(() => T.String, { description: 'The name of the skill (e.g., Athletics).' })
  public name!: string

  @field(() => T.String, { description: 'The canonical path of this resource in the REST API.' })
  public url!: string

  @field(() => T.String, { description: 'Timestamp of the last update.' })
  public updated_at!: string
}

export type SkillDocument = DocumentType<Skill>
const SkillModel = getModelForClass(Skill)

export default SkillModel
