import { getModelForClass, prop } from '@typegoose/typegoose';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { APIReference } from '@/models/2014/common/index.js';

export class EquipmentCategory {
  @prop({ type: () => [APIReference], index: true })
  public equipment!: APIReference[];

  @prop({ required: true, index: true })
  public index!: string;

  @prop({ required: true, index: true })
  public name!: string;

  @prop({ required: true, index: true })
  public url!: string;

  @prop({ required: true, index: true })
  public updated_at!: string;
}

export type EquipmentCategoryDocument = DocumentType<EquipmentCategory>;
const EquipmentCategoryModel = getModelForClass(EquipmentCategory, {
  schemaOptions: { collection: '2014-equipment-categories' },
});

export default EquipmentCategoryModel;
