import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { srdModelOptions } from '@/util/modelOptions'
import { ObjectType, Field } from 'type-graphql'

@ObjectType({ description: 'Schools of magic (e.g., Abjuration, Evocation).' })
@srdModelOptions('2014-magic-schools')
export class MagicSchool {
  @Field(() => String, { description: 'Description of the school of magic.' })
  @prop({ type: () => String, index: true, default: '' })
  public desc!: string

  @Field(() => String, { description: 'The unique identifier for this school (e.g., evocation).' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'The name of the school of magic.' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type MagicSchoolDocument = DocumentType<MagicSchool>
const MagicSchoolModel = getModelForClass(MagicSchool)

export default MagicSchoolModel
