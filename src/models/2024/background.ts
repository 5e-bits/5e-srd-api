import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { Choice } from '@/models/common/choice'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({ description: 'A reference to a feat with an optional note.' })
export class BackgroundFeatReference {
  @Field(() => String)
  @prop({ required: true, type: () => String })
  public index!: string

  @Field(() => String)
  @prop({ required: true, type: () => String })
  public name!: string

  @Field(() => String)
  @prop({ required: true, type: () => String })
  public url!: string

  @Field(() => String, { nullable: true })
  @prop({ type: () => String })
  public note?: string
}

@ObjectType({ description: 'A 2024 character background.' })
@srdModelOptions('2024-backgrounds')
export class Background2024 {
  @Field(() => String, { description: 'The unique identifier for this background.' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'The name of this background.' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @prop({ type: () => [APIReference], required: true })
  public ability_scores!: APIReference[]

  @prop({ type: () => BackgroundFeatReference, required: true })
  public feat!: BackgroundFeatReference

  @prop({ type: () => [APIReference], required: true })
  public proficiencies!: APIReference[]

  @prop({ type: () => [Choice] })
  public proficiency_choices?: Choice[]

  @prop({ type: () => [Choice] })
  public equipment_options?: Choice[]

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type BackgroundDocument = DocumentType<Background2024>
const BackgroundModel = getModelForClass(Background2024)

export default BackgroundModel
