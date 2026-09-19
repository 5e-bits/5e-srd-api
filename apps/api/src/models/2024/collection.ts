import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'

import { srdModelOptions } from '@/util/modelOptions'

@srdModelOptions('2024-collections')
export class Collection2024 {
  @prop({ required: true, index: true, type: () => String })
  public index!: string
}

export type CollectionDocument = DocumentType<Collection2024>
const CollectionModel = getModelForClass(Collection2024)

export default CollectionModel
