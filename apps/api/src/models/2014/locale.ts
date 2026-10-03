import { getModelForClass, index } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({ description: 'A supported translation locale for the 2014 SRD.' })
@srdModelOptions('2014-locales')
@index({ lang: 1 }, { unique: true })
export class Locale2014 {
  @field(T.String, {
    description: 'BCP 47 language tag, e.g. "de", "fr", "pt-BR".',
    required: true
  })
  public lang!: string

  @field(T.String, { required: true, gql: false })
  public updated_at!: string
}

export type Locale2014Document = DocumentType<Locale2014>
const Locale2014Model = getModelForClass(Locale2014)

export default Locale2014Model
