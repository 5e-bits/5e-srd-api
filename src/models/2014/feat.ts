import { getModelForClass, prop } from '@typegoose/typegoose';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { APIReference } from '@/models/2014/common';
import { srdModelOptions } from '@/util/modelOptions';

export class Prerequisite {
  @prop({ type: () => APIReference })
  public ability_score!: APIReference;

  @prop({ required: true, index: true })
  public minimum_score!: number;
}

@srdModelOptions('2014-feats')
export class Feat {
  @prop({ required: true, index: true })
  public index!: string;

  @prop({ required: true, index: true })
  public name!: string;

  @prop({ type: () => [Prerequisite] })
  public prerequisites!: Prerequisite[];

  @prop({ required: true, index: true })
  public desc!: string[];

  @prop({ required: true, index: true })
  public url!: string;

  @prop({ required: true, index: true })
  public updated_at!: string;
}

export type FeatDocument = DocumentType<Feat>;
const FeatModel = getModelForClass(Feat);

export default FeatModel;
