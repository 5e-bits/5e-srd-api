import { getModelForClass, prop } from '@typegoose/typegoose';
import { DocumentType } from '@typegoose/typegoose/lib/types';

export class Language {
  @prop({ required: true, index: true })
  public desc!: string[];

  @prop({ required: true, index: true })
  public index!: string;

  @prop({ required: true, index: true })
  public name!: string;

  @prop({ required: true, index: true })
  public script!: string;

  @prop({ required: true, index: true })
  public type!: string;

  @prop({ type: () => [String], index: true })
  public typical_speakers!: string[];

  @prop({ required: true, index: true })
  public url!: string;

  @prop({ required: true, index: true })
  public updated_at!: string;
}

export type LanguageDocument = DocumentType<Language>;
const LanguageModel = getModelForClass(Language, {
  schemaOptions: { collection: '2014-languages' },
});

export default LanguageModel;
