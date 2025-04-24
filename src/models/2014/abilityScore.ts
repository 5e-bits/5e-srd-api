import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { APIReference } from './common'
import { srdModelOptions } from '@/util/modelOptions'
import { ObjectType, Field } from 'type-graphql'
import { Skill } from './skill' // Import Skill for forward reference

@ObjectType({ description: 'Core character abilities (e.g., Strength, Dexterity).' })
@srdModelOptions('2014-ability-scores')
export class AbilityScore {
  @Field(() => [String], { description: 'Description of the ability score and its applications.' })
  @prop({ required: true, index: true, type: () => [String] })
  public desc!: string[]

  @Field(() => String, { description: 'Full name of the ability score.' })
  @prop({ required: true, index: true, type: () => String })
  public full_name!: string

  @Field(() => String, { description: 'Unique identifier for the ability score (e.g., str, dex).' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'Short name of the ability score (e.g., STR, DEX).' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  // Use forward reference here for the circular dependency
  @Field(() => [Skill], { description: 'Skills associated with this ability score.' })
  @prop({ type: () => [APIReference], default: [] }) // Store as APIReference array, default empty
  public skills!: APIReference[]

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type AbilityScoreDocument = DocumentType<AbilityScore>
const AbilityScoreModel = getModelForClass(AbilityScore)

export default AbilityScoreModel
