import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, ObjectType } from 'type-graphql'

import { Skill2024 } from '@/models/2024/skill'
import { APIReference } from '@/models/common/apiReference'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({
  description:
    'An ability score representing a fundamental character attribute (e.g., Strength, Dexterity).'
})
@srdModelOptions('2024-ability-scores')
export class AbilityScore2024 {
  @Field(() => String, {
    description: 'A description of the ability score and its applications.'
  })
  @prop({ required: true, index: true, type: () => String })
  public description!: string

  @Field(() => String, { description: 'The full name of the ability score (e.g., Strength).' })
  @prop({ required: true, index: true, type: () => String })
  public full_name!: string

  @Field(() => String, { description: 'The unique identifier for this ability score (e.g., str).' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'The abbreviated name of the ability score (e.g., STR).' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => [Skill2024], { description: 'Skills associated with this ability score.' })
  @prop({ type: () => [APIReference] })
  public skills!: APIReference[]

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type AbilityScoreDocument = DocumentType<AbilityScore2024>
const AbilityScoreModel = getModelForClass(AbilityScore2024)

export default AbilityScoreModel
