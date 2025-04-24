import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { APIReference } from '@/models/2014/common'
import { srdModelOptions } from '@/util/modelOptions'
import { ObjectType, Field, Int } from 'type-graphql'
import { AbilityScore } from './abilityScore'

@ObjectType({
  description: 'A prerequisite for acquiring a feat, typically an ability score minimum.'
})
export class Prerequisite {
  @Field(() => AbilityScore, { description: 'The ability score required.' })
  @prop({ type: () => APIReference, required: true })
  public ability_score!: APIReference

  @Field(() => Int, { description: 'The minimum score required in the specified ability score.' })
  @prop({ required: true, index: true, type: () => Number })
  public minimum_score!: number
}

@ObjectType({ description: 'Represents a feat that characters can take.' })
@srdModelOptions('2014-feats')
export class Feat {
  @Field(() => String, { description: 'Unique identifier for the feat (e.g., grappler).' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'Name of the feat.' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => [Prerequisite], { description: 'Prerequisites that must be met to take this feat.' })
  @prop({ type: () => [Prerequisite], default: [] })
  public prerequisites!: Prerequisite[]

  @Field(() => [String], { description: "Description of the feat's effects." })
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
