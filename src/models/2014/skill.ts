import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { APIReference } from '@/models/2014/common'
import { srdModelOptions } from '@/util/modelOptions'
import { ObjectType, Field } from 'type-graphql'
import { AbilityScore } from './abilityScore' // Import AbilityScore for forward reference

@ObjectType({ description: 'Represents a character skill (e.g., Acrobatics, Stealth).' })
@srdModelOptions('2014-skills')
export class Skill {
  // Use forward reference here for the circular dependency
  @Field(() => AbilityScore, { description: 'The ability score associated with this skill.' })
  @prop({ type: () => APIReference, required: true })
  public ability_score!: APIReference

  @Field(() => [String], { description: 'Description of the skill.' })
  @prop({ required: true, index: true, type: () => [String] })
  public desc!: string[]

  @Field(() => String, { description: 'Unique identifier for the skill (e.g., acrobatics).' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'Name of the skill.' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type SkillDocument = DocumentType<Skill>
const SkillModel = getModelForClass(Skill)

export default SkillModel
