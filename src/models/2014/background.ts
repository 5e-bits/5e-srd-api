import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { APIReference, Choice } from './common'
import { srdModelOptions } from '@/util/modelOptions'
import { ObjectType, Field, Int } from 'type-graphql'
import { APIReferenceObject, ChoiceObject } from '@/graphql/common/objects'

@ObjectType({ description: 'Reference to an equipment item with a quantity.' })
export class EquipmentRefObject {
  @Field(() => APIReferenceObject)
  @prop({ type: () => APIReference, required: true })
  equipment!: APIReferenceObject

  @Field(() => Int)
  @prop({ required: true, type: () => Number })
  quantity!: number
}

@ObjectType({ description: 'A feature granted by the background.' })
class BackgroundFeatureObject {
  @Field(() => String)
  @prop({ required: true, type: () => String })
  name!: string

  @Field(() => [String])
  @prop({ required: true, type: () => [String] })
  desc!: string[]
}

@ObjectType({ description: 'Represents a character background.' })
@srdModelOptions('2014-backgrounds')
export class Background {
  @Field(() => String, { description: 'Unique identifier for the background (e.g., acolyte).' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'Name of the background.' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => [APIReferenceObject], { description: 'Proficiencies granted at the start.' })
  @prop({ type: () => [APIReference], default: [] })
  public starting_proficiencies!: APIReference[]

  @Field(() => ChoiceObject, { description: 'Options for starting languages.' })
  @prop({ type: () => Choice })
  public language_options!: Choice

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => [EquipmentRefObject], { description: 'Equipment granted at the start.' })
  @prop({ type: () => [EquipmentRefObject], default: [] })
  public starting_equipment!: EquipmentRefObject[]

  @Field(() => [ChoiceObject], { description: 'Options for starting equipment.' })
  @prop({ type: () => [Choice], default: [] })
  public starting_equipment_options!: Choice[]

  @Field(() => BackgroundFeatureObject, { description: 'The main feature of the background.' })
  @prop({ type: () => BackgroundFeatureObject })
  public feature!: BackgroundFeatureObject

  @Field(() => ChoiceObject, { description: 'Options for personality traits.' })
  @prop({ type: () => Choice })
  public personality_traits!: Choice

  @Field(() => ChoiceObject, { description: 'Options for ideals.' })
  @prop({ type: () => Choice })
  public ideals!: Choice

  @Field(() => ChoiceObject, { description: 'Options for bonds.' })
  @prop({ type: () => Choice })
  public bonds!: Choice

  @Field(() => ChoiceObject, { description: 'Options for flaws.' })
  @prop({ type: () => Choice })
  public flaws!: Choice

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type BackgroundDocument = DocumentType<Background>
const BackgroundModel = getModelForClass(Background)

export default BackgroundModel
