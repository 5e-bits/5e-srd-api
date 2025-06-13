import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { srdModelOptions } from '@/util/modelOptions'

import { AbilityScore2024 } from './abilityScore'

@ObjectType({
  description: 'A skill representing proficiency in a specific task (e.g., Athletics, Stealth).'
})
@srdModelOptions('2024-skills')
export class Skill2024 {
  @Field(() => AbilityScore2024, { description: 'The ability score associated with this skill.' })
  @prop({ type: () => APIReference, required: true })
  public ability_score!: APIReference

  @Field(() => String, { description: 'A description of the skill.' })
  @prop({ required: true, index: true, type: () => String })
  public description!: string

  @Field(() => String, { description: 'The unique identifier for this skill (e.g., athletics).' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'The name of the skill (e.g., Athletics).' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type SkillDocument = DocumentType<Skill2024>
const SkillModel = getModelForClass(Skill2024)

export default SkillModel
