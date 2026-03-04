import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, Int, ObjectType } from 'type-graphql'

import { srdModelOptions } from '@/util/modelOptions'

import { Choice } from '../common/choice'

@ObjectType({ description: 'Prerequisites for a 2024 feat.' })
export class FeatPrerequisites2024 {
  @Field(() => Int, { nullable: true, description: 'Minimum character level required.' })
  @prop({ index: true, type: () => Number })
  public minimum_level?: number

  @Field(() => String, {
    nullable: true,
    description: 'Name of a feature (e.g. Spellcasting) required.'
  })
  @prop({ index: true, type: () => String })
  public feature_named?: string
}

@ObjectType({ description: 'A 2024 feat.' })
@srdModelOptions('2024-feats')
export class Feat2024 {
  @Field(() => String, { description: 'The unique identifier for this feat.' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'The name of this feat.' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => String, { description: 'Description of the feat.' })
  @prop({ required: true, type: () => String })
  public description!: string

  @Field(() => String, {
    description: 'The type of feat (origin, general, fighting-style, epic-boon).'
  })
  @prop({ required: true, index: true, type: () => String })
  public type!: string

  @Field(() => String, { nullable: true, description: 'Repeatability note, if applicable.' })
  @prop({ index: true, type: () => String })
  public repeatable?: string

  @Field(() => FeatPrerequisites2024, { nullable: true, description: 'Static prerequisites.' })
  @prop({ type: () => FeatPrerequisites2024 })
  public prerequisites?: FeatPrerequisites2024

  @prop({ type: () => Choice })
  public prerequisite_options?: Choice

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type FeatDocument = DocumentType<Feat2024>
const FeatModel = getModelForClass(Feat2024)

export default FeatModel
