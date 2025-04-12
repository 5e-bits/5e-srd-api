import { getModelForClass, prop } from '@typegoose/typegoose';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { APIReference } from '@/models/2014/common';
import { srdModelOptions } from '@/util/modelOptions';
class Reference {
  @prop({ required: true, index: true })
  public index!: string;

  @prop({ required: true, index: true })
  public name!: string;

  @prop({ required: true, index: true })
  public type!: string;

  @prop({ required: true, index: true })
  public url!: string;
}

@srdModelOptions('2014-proficiencies')
export class Proficiency {
  @prop({ type: () => [APIReference] })
  public classes?: APIReference[];

  @prop({ required: true, index: true })
  public index!: string;

  @prop({ required: true, index: true })
  public name!: string;

  @prop({ type: () => [APIReference] })
  public races?: APIReference[];

  @prop({ type: () => Reference })
  public reference!: Reference;

  @prop({ required: true, index: true })
  public type!: string;

  @prop({ required: true, index: true })
  public url!: string;

  @prop({ required: true, index: true })
  public updated_at!: string;
}

export type ProficiencyDocument = DocumentType<Proficiency>;
const ProficiencyModel = getModelForClass(Proficiency);

export default ProficiencyModel;
