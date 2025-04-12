import { getModelForClass, prop } from '@typegoose/typegoose';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { APIReference, Choice } from '@/models/2014/common';
import { srdModelOptions } from '@/util/modelOptions';
class AbilityBonus {
  @prop({ type: () => APIReference })
  public ability_score!: APIReference;

  @prop({ required: true, index: true })
  public bonus!: number;
}

@srdModelOptions('2014-subraces')
export class Subrace {
  @prop({ type: () => [AbilityBonus] })
  public ability_bonuses!: AbilityBonus[];

  @prop({ required: true, index: true })
  public desc!: string;

  @prop({ required: true, index: true })
  public index!: string;

  @prop({ type: () => Choice })
  public language_options?: Choice;

  @prop({ required: true, index: true })
  public name!: string;

  @prop({ type: () => APIReference })
  public race!: APIReference;

  @prop({ type: () => [APIReference] })
  public racial_traits!: APIReference[];

  @prop({ type: () => [APIReference] })
  public starting_proficiencies?: APIReference[];

  @prop({ required: true, index: true })
  public url!: string;

  @prop({ required: true, index: true })
  public updated_at!: string;
}

export type SubraceDocument = DocumentType<Subrace>;
const SubraceModel = getModelForClass(Subrace);

export default SubraceModel;
