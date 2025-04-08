import { getModelForClass, prop } from '@typegoose/typegoose';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { APIReference } from '@/models/2014/common/index.js';

export class Rule {
  @prop({ required: true, index: true })
  public desc!: string;

  @prop({ required: true, index: true })
  public index!: string;

  @prop({ required: true, index: true })
  public name!: string;

  @prop({ type: () => [APIReference], index: true })
  public subsections!: APIReference[];

  @prop({ required: true, index: true })
  public url!: string;

  @prop({ required: true, index: true })
  public updated_at!: string;
}

export type RuleDocument = DocumentType<Rule>;
const RuleModel = getModelForClass(Rule, {
  schemaOptions: { collection: '2014-rules' },
});

export default RuleModel;
