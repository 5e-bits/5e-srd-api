import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, Int, ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { srdModelOptions } from '@/util/modelOptions'

import { AbilityScore } from './abilityScore'

@ObjectType({ description: 'A prerequisite for taking a feat, usually a minimum ability score.' })
export class Prerequisite {
  @Field(() => AbilityScore, {
    nullable: true,
    description: 'The ability score required for this prerequisite.'
  })
  @prop({ type: () => APIReference })
  public ability_score!: APIReference

  @Field(() => Int, { description: 'The minimum score required in the referenced ability score.' })
  @prop({ required: true, index: true, type: () => Number })
  public minimum_score!: number
}

@ObjectType({
  description: 'A feat representing a special talent or expertise giving unique capabilities.'
})
@srdModelOptions('2014-feats')
export class Feat {
  @Field(() => String, { description: 'The unique identifier for this feat (e.g., grappler).' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'The name of the feat (e.g., Grappler).' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => [Prerequisite], { description: 'Prerequisites that must be met to take the feat.' })
  @prop({ type: () => [Prerequisite] })
  public prerequisites!: Prerequisite[]

  @Field(() => [String], { description: 'A description of the benefits conferred by the feat.' })
  @prop({ required: true, index: true, type: () => [String] })
  public desc!: string[]

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type FeatDocument = DocumentType<Feat>
const FeatModel = getModelForClass(Feat)

export default FeatModel
