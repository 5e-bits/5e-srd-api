import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { APIReference, Choice } from './common'
import { srdModelOptions } from '@/util/modelOptions'
import { ObjectType, Field, Int } from 'type-graphql'
import { APIReferenceObject, ChoiceObject } from '@/graphql/common/objects'

@ObjectType({ description: 'Reference to an equipment item with a quantity.' })
export class EquipmentRefObject {
  @Field(() => APIReferenceObject)
  equipment!: APIReferenceObject

  @Field(() => Int)
  quantity!: number
}

@ObjectType({ description: 'A feature granted by the background.' })
class BackgroundFeatureObject {
  @Field(() => String)
  name!: string

  @Field(() => [String])
  desc!: string[]
}

class Feature {
  @prop({ required: true, type: () => String })
  public name!: string

  @prop({ required: true, type: () => [String] })
  public desc!: string[]
}

export class EquipmentRef {
  @prop({ type: () => APIReference })
  public equipment!: APIReference

  @prop({ required: true, type: () => Number })
  public quantity!: number
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
  @prop({ type: () => [EquipmentRef], default: [] })
  public starting_equipment!: EquipmentRef[]

  @prop({ type: () => [Choice], index: true })
  public starting_equipment_options!: Choice[]

  @prop({ type: () => Feature })
  public feature!: Feature

  @prop({ type: () => Choice })
  public personality_traits!: Choice

  @prop({ type: () => Choice })
  public ideals!: Choice

  @prop({ type: () => Choice })
  public bonds!: Choice

  @prop({ type: () => Choice })
  public flaws!: Choice

  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type BackgroundDocument = DocumentType<Background>
const BackgroundModel = getModelForClass(Background)

export default BackgroundModel
