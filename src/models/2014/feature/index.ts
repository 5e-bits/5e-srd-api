import { getModelForClass, prop } from '@typegoose/typegoose';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { APIReference, Choice } from '@/models/2014/common/index.js';

class LevelPrerequisite {
  @prop({ required: true, index: true })
  public type!: string;

  @prop({ required: true, index: true })
  public level!: number;
}

class FeaturePrerequisite {
  @prop({ required: true, index: true })
  public type!: string;

  @prop({ required: true, index: true })
  public feature!: string;
}

class SpellPrerequisite {
  @prop({ required: true, index: true })
  public type!: string;

  @prop({ required: true, index: true })
  public spell!: string;
}

class FeatureSpecific {
  @prop({ type: () => Choice })
  public subfeature_options?: Choice;

  @prop({ type: () => Choice })
  public expertise_options?: Choice;

  @prop({ type: () => Choice })
  public terrain_type_options?: Choice;

  @prop({ type: () => Choice })
  public enemy_type_options?: Choice;

  @prop({ type: () => [APIReference] })
  public invocations?: APIReference[];
}

export class Feature {
  @prop({ type: () => APIReference })
  public class!: APIReference;

  @prop({ required: true, index: true })
  public desc!: string[];

  @prop({ type: () => APIReference })
  public parent?: APIReference;

  @prop({ required: true, index: true })
  public index!: string;

  @prop({ required: true, index: true })
  public level!: number;

  @prop({ required: true, index: true })
  public name!: string;

  @prop({ type: () => [LevelPrerequisite, FeaturePrerequisite, SpellPrerequisite] })
  public prerequisites?: (LevelPrerequisite | FeaturePrerequisite | SpellPrerequisite)[];

  @prop({ index: true })
  public reference?: string;

  @prop({ type: () => APIReference })
  public subclass?: APIReference;

  @prop({ type: () => FeatureSpecific })
  public feature_specific?: FeatureSpecific;

  @prop({ required: true, index: true })
  public url!: string;

  @prop({ required: true, index: true })
  public updated_at!: string;
}

export type FeatureDocument = DocumentType<Feature>;
const FeatureModel = getModelForClass(Feature, {
  schemaOptions: { collection: '2014-features' },
});

export default FeatureModel;
