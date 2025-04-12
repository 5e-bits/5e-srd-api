import { getModelForClass, prop } from '@typegoose/typegoose';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { APIReference } from '@/models/2014/common';
import { srdModelOptions } from '@/util/modelOptions';

@srdModelOptions('2014-skills')
export class Skill {
  @prop({ type: () => APIReference })
  public ability_score!: APIReference;

  @prop({ required: true, index: true })
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

export type SkillDocument = DocumentType<Skill>;
const SkillModel = getModelForClass(Skill);

export default SkillModel;
