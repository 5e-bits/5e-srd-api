import { getModelForClass, prop } from '@typegoose/typegoose';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { srdModelOptions } from '@/util/modelOptions';

@srdModelOptions('2014-collections')
export class Collection {
  @prop({ required: true, index: true })
  public index!: string;
}

export type CollectionDocument = DocumentType<Collection>;
const CollectionModel = getModelForClass(Collection);

export default CollectionModel;
