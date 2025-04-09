import { getModelForClass, prop } from '@typegoose/typegoose';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { APIReference } from '@/models/2014/common';

class SpellPrerequisite {
  @prop({ required: true, index: true })
  public index!: string;

  @prop({ required: true, index: true })
  public name!: string;

  @prop({ required: true, index: true })
  public type!: string;

  @prop({ required: true, index: true })
  public url!: string;
}

class Spell {
  @prop({ type: () => [SpellPrerequisite] })
  public prerequisites!: SpellPrerequisite[];

  @prop({ type: () => APIReference })
  public spell!: APIReference;
}

export class Subclass {
  @prop({ type: () => APIReference })
  public class!: APIReference;

  @prop({ required: true, index: true })
  public desc!: string[];

  @prop({ required: true, index: true })
  public index!: string;

  @prop({ required: true, index: true })
  public name!: string;

  @prop({ type: () => [Spell] })
  public spells?: Spell[];

  @prop({ required: true, index: true })
  public subclass_flavor!: string;

  @prop({ required: true, index: true })
  public subclass_levels!: string;

  @prop({ required: true, index: true })
  public url!: string;

  @prop({ required: true, index: true })
  public updated_at!: string;
}

export type SubclassDocument = DocumentType<Subclass>;
const SubclassModel = getModelForClass(Subclass, {
  schemaOptions: { collection: '2014-subclasses' },
});

export default SubclassModel;
