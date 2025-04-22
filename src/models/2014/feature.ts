import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { APIReference, Choice } from '@/models/2014/common'
import { srdModelOptions } from '@/util/modelOptions'

// Export nested classes
export class LevelPrerequisite {
  @prop({ required: true, index: true, type: () => String })
  public type!: string

  @prop({ required: true, index: true, type: () => Number })
  public level!: number
}

export class FeaturePrerequisite {
  @prop({ required: true, index: true, type: () => String })
  public type!: string

  @prop({ required: true, index: true, type: () => String })
  public feature!: string
}

export class SpellPrerequisite {
  @prop({ required: true, index: true, type: () => String })
  public type!: string

  @prop({ required: true, index: true, type: () => String })
  public spell!: string
}

export type Prerequisite = LevelPrerequisite | FeaturePrerequisite | SpellPrerequisite

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

@srdModelOptions('2014-features')
export class Feature {
  @prop({ type: () => APIReference })
  public class!: APIReference

  @prop({ required: true, index: true, type: () => [String] })
  public desc!: string[]

  @prop({ type: () => APIReference })
  public parent?: APIReference

  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @prop({ required: true, index: true, type: () => Number })
  public level!: number

  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @prop({ type: () => [Object] })
  public prerequisites?: Prerequisite[]

  @prop({ index: true, type: () => String })
  public reference?: string

  @prop({ type: () => APIReference })
  public subclass?: APIReference

  @prop({ type: () => FeatureSpecific })
  public feature_specific?: FeatureSpecific

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type FeatureDocument = DocumentType<Feature>
const FeatureModel = getModelForClass(Feature)

export default FeatureModel
