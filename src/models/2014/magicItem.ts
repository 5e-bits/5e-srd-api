import { getModelForClass, prop } from '@typegoose/typegoose';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { APIReference } from './common';

class Rarity {
  @prop({ required: true, index: true })
  public name!: string;
}

export class MagicItem {
  @prop({ type: () => [String], index: true })
  public desc!: string[];

  @prop({ type: () => APIReference, index: true })
  public equipment_category!: APIReference;

  @prop({ type: () => String, index: true })
  public image!: string;

  @prop({ required: true, index: true })
  public index!: string;

  @prop({ required: true, index: true })
  public name!: string;

  @prop({ required: true, index: true })
  public rarity!: Rarity;

  @prop({ required: true, index: true })
  public url!: string;

  @prop({ type: () => [APIReference], index: true })
  public variants!: APIReference[];

  @prop({ required: true, index: true })
  public variant!: boolean;

  @prop({ required: true, index: true })
  public updated_at!: string;
}

export type MagicItemDocument = DocumentType<MagicItem>;
const MagicItemModel = getModelForClass(MagicItem, {
  schemaOptions: { collection: '2014-magic-items' },
});

export default MagicItemModel;
