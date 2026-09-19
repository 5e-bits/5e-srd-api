import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, Int, ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { Choice } from '@/models/common/choice'
import { srdModelOptions } from '@/util/modelOptions'

import { Class } from './class'
import { Spell } from './spell'
import { Subclass } from './subclass'

// Export nested classes
@ObjectType({ description: 'Prerequisite based on character level' })
export class LevelPrerequisite {
  @Field(() => String, { description: 'Type indicator for this prerequisite.' })
  @prop({ required: true, index: true, type: () => String })
  public type!: string

  @Field(() => Int, { description: 'The character level required.' })
  @prop({ required: true, index: true, type: () => Number })
  public level!: number
}

@ObjectType({ description: 'Prerequisite based on having another feature' })
export class FeaturePrerequisite {
  @Field(() => String, { description: 'Type indicator for this prerequisite.' })
  @prop({ required: true, index: true, type: () => String })
  public type!: string

  @Field(() => Feature, { description: 'The specific feature required.' })
  @prop({ required: true, index: true, type: () => String })
  public feature!: string
}

@ObjectType({ description: 'Prerequisite based on knowing a specific spell' })
export class SpellPrerequisite {
  @Field(() => String, { description: 'Type indicator for this prerequisite.' })
  @prop({ required: true, index: true, type: () => String })
  public type!: string

  @Field(() => Spell, { description: 'The specific spell required.' })
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

  @Field(() => [Feature], { nullable: true, description: 'Invocations related to this feature.' })
  @prop({ type: () => [APIReference] })
  public invocations?: APIReference[]
}

@ObjectType({ description: 'Represents a class or subclass feature.' })
@srdModelOptions('2014-features')
export class Feature {
  @Field(() => Class, { nullable: true, description: 'The class that gains this feature.' })
  @prop({ type: () => APIReference })
  public class!: APIReference

  @Field(() => [String], { description: 'Description of the feature.' })
  @prop({ required: true, index: true, type: () => [String] })
  public desc!: string[]

  @Field(() => Feature, { nullable: true, description: 'A parent feature, if applicable.' })
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

  // Handled by FeatureResolver
  @prop({ type: () => [Object] })
  public prerequisites?: Prerequisite[]

  @Field(() => String, {
    nullable: true,
    description: 'Reference information (e.g., book and page number).'
  })
  @prop({ index: true, type: () => String })
  public reference?: string

  @Field(() => Subclass, {
    nullable: true,
    description: 'The subclass that gains this feature, if applicable.'
  })
  @prop({ type: () => APIReference })
  public subclass?: APIReference

  @Field(() => FeatureSpecific, {
    nullable: true,
    description: 'Specific details for this feature, if applicable.'
  })
  @prop({ type: () => FeatureSpecific })
  public feature_specific?: FeatureSpecific

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type FeatureDocument = DocumentType<Feature>
const FeatureModel = getModelForClass(Feature)

export default FeatureModel
