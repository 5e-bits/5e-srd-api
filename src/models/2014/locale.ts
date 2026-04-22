import { getModelForClass, index, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, ObjectType } from 'type-graphql'

import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({ description: 'A supported translation locale for the 2014 SRD.' })
@srdModelOptions('2014-locales')
@index({ lang: 1 }, { unique: true })
export class Locale2014 {
  @Field(() => String, { description: 'BCP 47 language tag, e.g. "de", "fr", "pt-BR".' })
  @prop({ required: true, type: () => String })
  public lang!: string

  @prop({ required: true, type: () => String })
  public updated_at!: string
}

export type Locale2014Document = DocumentType<Locale2014>
const Locale2014Model = getModelForClass(Locale2014)

export default Locale2014Model
