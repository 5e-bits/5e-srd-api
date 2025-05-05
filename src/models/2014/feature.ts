import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { APIReference, Choice } from '@/models/2014/common'
import { srdModelOptions } from '@/util/modelOptions'
import { ObjectType, Field, Int } from 'type-graphql'

// Export nested classes
@ObjectType({ description: 'Prerequisite based on character level' })
export class LevelPrerequisite {
  @prop({ required: true, index: true, type: () => String })
  public type!: string

  @prop({ required: true, index: true, type: () => Number })
  public level!: number
}

@ObjectType({ description: 'Prerequisite based on having another feature' })
export class FeaturePrerequisite {
  @prop({ required: true, index: true, type: () => String })
  public type!: string

  @prop({ required: true, index: true, type: () => String })
  public feature!: string
}

@ObjectType({ description: 'Prerequisite based on knowing a specific spell' })
export class SpellPrerequisite {
  @prop({ required: true, index: true, type: () => String })
  public type!: string

  @prop({ required: true, index: true, type: () => String })
  public spell!: string
}

export type Prerequisite = LevelPrerequisite | FeaturePrerequisite | SpellPrerequisite

@ObjectType({ description: 'Specific details related to a feature' })
export class FeatureSpecific {
  @prop({ type: () => Choice })
  public subfeature_options?: Choice

  @prop({ type: () => Choice })
  public expertise_options?: Choice

  @prop({ type: () => Choice })
  public terrain_type_options?: Choice

  @prop({ type: () => Choice })
  public enemy_type_options?: Choice

  @prop({ type: () => [APIReference] })
  public invocations?: APIReference[]
}

@ObjectType({ description: 'Represents a class or subclass feature.' })
@srdModelOptions('2014-features')
export class Feature {
  // TODO: Pass 2 - API Reference
  @prop({ type: () => APIReference })
  public class!: APIReference

  @Field(() => [String], { description: 'Description of the feature.' })
  @prop({ required: true, index: true, type: () => [String] })
  public desc!: string[]

  // TODO: Pass 2 - API Reference (Optional)
  @prop({ type: () => APIReference })
  public parent?: APIReference

  @Field(() => String, { description: 'Unique identifier for this feature.' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => Int, { description: 'Level at which the feature is gained.' })
  @prop({ required: true, index: true, type: () => Number })
  public level!: number

  @Field(() => String, { description: 'Name of the feature.' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  // TODO: Pass 2/3 - Prerequisite array (complex type/union)
  @prop({ type: () => [Object] })
  public prerequisites?: Prerequisite[]

  @Field(() => String, {
    nullable: true,
    description: 'Reference information (e.g., book and page number).'
  })
  @prop({ index: true, type: () => String })
  public reference?: string

  // TODO: Pass 2 - API Reference (Optional)
  @prop({ type: () => APIReference })
  public subclass?: APIReference

  // TODO: Pass 2/3 - Feature Specific details (complex type)
  @prop({ type: () => FeatureSpecific })
  public feature_specific?: FeatureSpecific

  // url field is not exposed via GraphQL
  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type FeatureDocument = DocumentType<Feature>
const FeatureModel = getModelForClass(Feature)

export default FeatureModel
