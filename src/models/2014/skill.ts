import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { APIReference } from '@/models/2014/common'
import { srdModelOptions } from '@/util/modelOptions'
import { ObjectType, Field } from 'type-graphql'

@ObjectType({
  description: 'A skill representing proficiency in a specific task (e.g., Athletics, Stealth).'
})
@srdModelOptions('2014-skills')
export class Skill {
  // ability_score field is skipped in Pass 1 - TODO: Pass 2 - Implement reference resolver
  @prop({ type: () => APIReference, required: true })
  public ability_score!: APIReference

  @Field(() => [String], { description: 'A description of the skill.' })
  @prop({ required: true, index: true, type: () => [String] })
  public desc!: string[]

  @Field(() => String, { description: 'The unique identifier for this skill (e.g., athletics).' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'The name of the skill (e.g., Athletics).' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  // url is intentionally not decorated with @Field
  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type SkillDocument = DocumentType<Skill>
const SkillModel = getModelForClass(Skill)

export default SkillModel
