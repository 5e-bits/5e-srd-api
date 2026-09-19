import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, Int, ObjectType } from 'type-graphql'

import { Class2024 } from '@/models/2024/class'
import { APIReference } from '@/models/common/apiReference'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({ description: 'A feature granted by a 2024 subclass at a specific level.' })
export class SubclassFeature2024 {
  @Field(() => String, { description: 'The name of the subclass feature.' })
  @prop({ required: true, type: () => String })
  public name!: string

  @Field(() => Int, { description: 'The character level at which this feature is gained.' })
  @prop({ required: true, type: () => Number })
  public level!: number

  @Field(() => String, { description: 'A description of the subclass feature.' })
  @prop({ required: true, type: () => String })
  public description!: string
}

@ObjectType({ description: 'A subclass representing a specialization of a class in D&D 5e 2024.' })
@srdModelOptions('2024-subclasses')
export class Subclass2024 {
  @Field(() => String, { description: 'The unique identifier for this subclass.' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'The name of the subclass.' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => Class2024, { description: 'The parent class for this subclass.' })
  @prop({ type: () => APIReference, required: true })
  public class!: APIReference

  @Field(() => String, { description: 'A brief summary of the subclass.' })
  @prop({ required: true, type: () => String })
  public summary!: string

  @Field(() => String, { description: 'A full description of the subclass.' })
  @prop({ required: true, type: () => String })
  public description!: string

  @Field(() => [SubclassFeature2024], { description: 'Features granted by this subclass.' })
  @prop({ required: true, type: () => [SubclassFeature2024] })
  public features!: SubclassFeature2024[]

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type SubclassDocument = DocumentType<Subclass2024>
const SubclassModel = getModelForClass(Subclass2024)

export default SubclassModel
