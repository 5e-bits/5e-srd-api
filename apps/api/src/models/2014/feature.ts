import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { Choice } from '@/models/common/choice'
import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

import { Class } from './class'
import { Spell } from './spell'
import { Subclass } from './subclass'

// Export nested classes
@ObjectType({ description: 'Prerequisite based on character level' })
export class LevelPrerequisite {
  @field(T.String, {
    description: 'Type indicator for this prerequisite.',
    required: true,
    index: true
  })
  public type!: string

  @field(T.Int, { description: 'The character level required.', required: true, index: true })
  public level!: number
}

@ObjectType({ description: 'Prerequisite based on having another feature' })
export class FeaturePrerequisite {
  @field(T.String, {
    description: 'Type indicator for this prerequisite.',
    required: true,
    index: true
  })
  public type!: string

  @field(
    { db: () => String, gql: () => Feature },
    { description: 'The specific feature required.', required: true, index: true }
  )
  public feature!: string
}

@ObjectType({ description: 'Prerequisite based on knowing a specific spell' })
export class SpellPrerequisite {
  @field(T.String, {
    description: 'Type indicator for this prerequisite.',
    required: true,
    index: true
  })
  public type!: string

  @field(
    { db: () => String, gql: () => Spell },
    { description: 'The specific spell required.', required: true, index: true }
  )
  public spell!: string
}

export type Prerequisite = LevelPrerequisite | FeaturePrerequisite | SpellPrerequisite

@ObjectType({ description: 'Specific details related to a feature' })
export class FeatureSpecific {
  @field(T.Model(() => Choice), { gql: false })
  public subfeature_options?: Choice

  @field(T.Model(() => Choice), { gql: false })
  public expertise_options?: Choice

  @field(T.Model(() => Choice), { gql: false })
  public terrain_type_options?: Choice

  @field(T.Model(() => Choice), { gql: false })
  public enemy_type_options?: Choice

  @field(T.RefList(() => Feature), {
    description: 'Invocations related to this feature.',
    gql: { nullable: true }
  })
  public invocations?: APIReference[]
}

@ObjectType({ description: 'Represents a class or subclass feature.' })
@srdModelOptions('2014-features')
export class Feature {
  @field(T.Ref(() => Class), {
    description: 'The class that gains this feature.',
    gql: { nullable: true }
  })
  public class!: APIReference

  @field(T.List(T.String), {
    description: 'Description of the feature.',
    required: true,
    index: true
  })
  public desc!: string[]

  @field(T.Ref(() => Feature), {
    description: 'A parent feature, if applicable.',
    gql: { nullable: true }
  })
  public parent?: APIReference

  @field(T.String, {
    description: 'Unique identifier for this feature.',
    required: true,
    index: true
  })
  public index!: string

  @field(T.Int, {
    description: 'Level at which the feature is gained.',
    required: true,
    index: true
  })
  public level!: number

  @field(T.String, { description: 'Name of the feature.', required: true, index: true })
  public name!: string

  // Handled by FeatureResolver
  @field(T.List(() => Object), { gql: false })
  public prerequisites?: Prerequisite[]

  @field(T.String, {
    description: 'Reference information (e.g., book and page number).',
    index: true,
    gql: { nullable: true }
  })
  public reference?: string

  @field(T.Ref(() => Subclass), {
    description: 'The subclass that gains this feature, if applicable.',
    gql: { nullable: true }
  })
  public subclass?: APIReference

  @field(T.Model(() => FeatureSpecific), {
    description: 'Specific details for this feature, if applicable.',
    gql: { nullable: true }
  })
  public feature_specific?: FeatureSpecific

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.String, { description: 'Timestamp of the last update.', required: true, index: true })
  public updated_at!: string
}

export type FeatureDocument = DocumentType<Feature>
const FeatureModel = getModelForClass(Feature)

export default FeatureModel
