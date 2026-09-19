import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, Int, ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { Choice } from '@/models/common/choice'
import { srdModelOptions } from '@/util/modelOptions'

import { Equipment } from './equipment'
import { Proficiency } from './proficiency'

@ObjectType({ description: 'Reference to a piece of equipment with a quantity.' })
export class EquipmentRef {
  @Field(() => Equipment, { description: 'The specific equipment referenced.' })
  @prop({ type: () => APIReference })
  public equipment!: APIReference

  @Field(() => Int, { description: 'The quantity of the referenced equipment.' })
  @prop({ required: true, index: true, type: () => Number })
  public quantity!: number
}

@ObjectType({ description: 'A special feature granted by the background.' })
class BackgroundFeature {
  @Field(() => String, { description: 'The name of the background feature.' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => [String], { description: 'The description of the background feature.' })
  @prop({ required: true, index: true, type: () => [String] })
  public desc!: string[]
}

@ObjectType({
  description: 'Represents a character background providing flavor, proficiencies, and features.'
})
@srdModelOptions('2014-backgrounds')
export class Background {
  @Field(() => String, {
    description: 'The unique identifier for this background (e.g., acolyte).'
  })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'The name of the background (e.g., Acolyte).' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => [Proficiency], { description: 'Proficiencies granted by this background at start.' })
  @prop({ type: () => [APIReference] })
  public starting_proficiencies!: APIReference[]

  // Handled by BackgroundResolver
  @prop({ type: () => Choice })
  public language_options!: Choice

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => [EquipmentRef], { description: 'Equipment received when choosing this background.' })
  @prop({ type: () => [EquipmentRef] })
  public starting_equipment!: EquipmentRef[]

  // Handled by BackgroundResolver
  @prop({ type: () => [Choice], index: true })
  public starting_equipment_options!: Choice[]

  @Field(() => BackgroundFeature, { description: 'The feature associated with this background.' })
  @prop({ type: () => BackgroundFeature })
  public feature!: BackgroundFeature

  // Handled by BackgroundResolver
  @prop({ type: () => Choice })
  public personality_traits!: Choice

  // Handled by BackgroundResolver
  @prop({ type: () => Choice })
  public ideals!: Choice

  // Handled by BackgroundResolver
  @prop({ type: () => Choice })
  public bonds!: Choice

  // Handled by BackgroundResolver
  @prop({ type: () => Choice })
  public flaws!: Choice

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type BackgroundDocument = DocumentType<Background>
const BackgroundModel = getModelForClass(Background)

export default BackgroundModel
