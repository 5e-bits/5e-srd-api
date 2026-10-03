import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'

import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

@srdModelOptions('2024-collections')
export class Collection2024 {
  @field(T.String, { required: true, index: true, gql: false })
  public index!: string
}

export type CollectionDocument = DocumentType<Collection2024>
const CollectionModel = getModelForClass(Collection2024)

export default CollectionModel
