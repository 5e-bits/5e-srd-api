import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, ObjectType } from 'type-graphql'

import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({
  description: 'A school of magic, representing a particular tradition like Evocation or Illusion.'
})
@srdModelOptions('2024-magic-schools')
export class MagicSchool2024 {
  @Field(() => String, { description: 'A brief description of the school of magic.' })
  @prop({ type: () => String, index: true })
  public description!: string

  @Field(() => String, { description: 'The unique identifier for this school (e.g., evocation).' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'The name of the school (e.g., Evocation).' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type MagicSchoolDocument = DocumentType<MagicSchool2024>
const MagicSchoolModel = getModelForClass(MagicSchool2024)

export default MagicSchoolModel
