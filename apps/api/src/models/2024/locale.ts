import { getModelForClass, index, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, ObjectType } from 'type-graphql'

import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({ description: 'A supported translation locale for the 2024 SRD.' })
@srdModelOptions('2024-locales')
@index({ lang: 1 }, { unique: true })
export class Locale2024 {
  @Field(() => String, { description: 'BCP 47 language tag, e.g. "de", "fr", "pt-BR".' })
  @prop({ required: true, type: () => String })
  public lang!: string

  @prop({ required: true, type: () => String })
  public updated_at!: string
}

export type Locale2024Document = DocumentType<Locale2024>
const Locale2024Model = getModelForClass(Locale2024)

export default Locale2024Model
