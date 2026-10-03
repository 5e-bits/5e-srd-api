import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'

import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

@srdModelOptions('2014-collections')
export class Collection {
  @field(T.String, { required: true, index: true, gql: false })
  public index!: string
}

export type CollectionDocument = DocumentType<Collection>
const CollectionModel = getModelForClass(Collection)

export default CollectionModel
