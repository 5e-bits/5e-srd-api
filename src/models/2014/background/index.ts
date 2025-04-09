import { getModelForClass, prop } from '@typegoose/typegoose';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { APIReference, Choice } from '../common/index.js';

export class EquipmentRef {
  @prop({ type: () => APIReference })
  public equipment!: APIReference;

  @prop({ required: true, index: true })
  public quantity!: number;
}

class Feature {
  @prop({ required: true, index: true })
  public name!: string;

  @prop({ required: true, index: true })
  public desc!: string[];
}

export class Background {
  @prop({ required: true, index: true })
  public index!: string;

  @prop({ required: true, index: true })
  public name!: string;

  @prop({ type: () => APIReference })
  public starting_proficiencies!: APIReference[];

  @prop({ type: () => Choice })
  public language_options!: Choice;

  @prop({ required: true, index: true })
  public url!: string;

  @prop({ type: () => EquipmentRef })
  public starting_equipment!: EquipmentRef[];

  @prop({ type: () => [Choice], index: true })
  public starting_equipment_options!: Choice[];

  @prop({ type: () => Feature })
  public feature!: Feature;

  @prop({ type: () => Choice })
  public personality_traits!: Choice;

  @prop({ type: () => Choice })
  public ideals!: Choice;

  @prop({ type: () => Choice })
  public bonds!: Choice;

  @prop({ type: () => Choice })
  public flaws!: Choice;

  @prop({ required: true, index: true })
  public updated_at!: string;
}

export type BackgroundDocument = DocumentType<Background>;
const BackgroundModel = getModelForClass(Background, {
  schemaOptions: { collection: '2014-backgrounds' },
});

export default BackgroundModel;
