import { getModelForClass, prop } from '@typegoose/typegoose';
import { DocumentType } from '@typegoose/typegoose/lib/types';

export class Collection {
  @prop({ required: true, index: true })
  public index!: string;
}

export type CollectionDocument = DocumentType<Collection>;
const CollectionModel = getModelForClass(Collection, {
  schemaOptions: { collection: '2014-collections' },
});

export default CollectionModel;
