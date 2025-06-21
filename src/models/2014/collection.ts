import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'

import { field, T } from '@/util/fieldDectorator'
import { srdModelOptions } from '@/util/modelOptions'

@srdModelOptions('2014-collections')
export class Collection {
  @field(() => T.String, { skipResolver: true })
  public index!: string
}

export type CollectionDocument = DocumentType<Collection>
const CollectionModel = getModelForClass(Collection)

export default CollectionModel
