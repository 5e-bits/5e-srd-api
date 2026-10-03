import { getModelForClass, index } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({ description: 'A supported translation locale for the 2024 SRD.' })
@srdModelOptions('2024-locales')
@index({ lang: 1 }, { unique: true })
export class Locale2024 {
  @field(T.String, {
    description: 'BCP 47 language tag, e.g. "de", "fr", "pt-BR".',
    required: true
  })
  public lang!: string

  @field(T.String, { required: true, gql: false })
  public updated_at!: string
}

export type Locale2024Document = DocumentType<Locale2024>
const Locale2024Model = getModelForClass(Locale2024)

export default Locale2024Model
