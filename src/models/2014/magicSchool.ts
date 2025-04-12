import { getModelForClass, prop } from '@typegoose/typegoose';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { srdModelOptions } from '@/util/modelOptions';

@srdModelOptions('2014-magic-schools')
export class MagicSchool {
  @prop({ type: () => [String], index: true })
  public desc!: string[];

  @prop({ required: true, index: true })
  public index!: string;

  @prop({ required: true, index: true })
  public name!: string;

  @prop({ required: true, index: true })
  public url!: string;

  @prop({ required: true, index: true })
  public updated_at!: string;
}

export type MagicSchoolDocument = DocumentType<MagicSchool>;
const MagicSchoolModel = getModelForClass(MagicSchool);

export default MagicSchoolModel;
