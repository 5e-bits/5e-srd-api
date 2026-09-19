import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({ description: 'A 2024 proficiency.' })
@srdModelOptions('2024-proficiencies')
export class Proficiency2024 {
  @Field(() => String, { description: 'The unique identifier for this proficiency.' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'The name of this proficiency.' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => String, { description: 'The type of proficiency (e.g., Skills, Tools).' })
  @prop({ required: true, index: true, type: () => String })
  public type!: string

  @prop({ type: () => [APIReference], required: true })
  public backgrounds!: APIReference[]

  @prop({ type: () => [APIReference], required: true })
  public classes!: APIReference[]

  @Field(() => APIReference, { nullable: true, description: 'The referenced skill or tool.' })
  @prop({ type: () => APIReference })
  public reference?: APIReference

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type ProficiencyDocument = DocumentType<Proficiency2024>
const ProficiencyModel = getModelForClass(Proficiency2024)

export default ProficiencyModel
