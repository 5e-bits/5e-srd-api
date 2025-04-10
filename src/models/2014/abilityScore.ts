import { getModelForClass, prop } from '@typegoose/typegoose';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { APIReference } from './common';

export class AbilityScore {
  @prop({ required: true, index: true })
  public desc!: string[];

  @prop({ required: true, index: true })
  public full_name!: string;

  @prop({ required: true, index: true })
  public index!: string;

  @prop({ required: true, index: true })
  public name!: string;

  @prop({ type: () => APIReference })
  public skills!: APIReference[];

  @prop({ required: true, index: true })
  public url!: string;

  @prop({ required: true, index: true })
  public updated_at!: string;
}

export type AbilityScoreDocument = DocumentType<AbilityScore>;
const AbilityScoreModel = getModelForClass(AbilityScore, {
  schemaOptions: { collection: '2014-ability-scores' },
});

export default AbilityScoreModel;
