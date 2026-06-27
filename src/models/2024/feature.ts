import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, ObjectType } from 'type-graphql'

import { Class2024 } from '@/models/2024/class'
import { Subclass2024 } from '@/models/2024/subclass'
import { APIReference } from '@/models/common/apiReference'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({ description: 'A 2024 class or subclass feature.' })
@srdModelOptions('2024-features')
export class Feature2024 {
  @Field(() => String, { description: 'The unique identifier for this feature.' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'The name of this feature.' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => String, { description: 'Description of the feature.' })
  @prop({ required: true, type: () => String })
  public description!: string

  @Field(() => APIReference, { description: 'The level at which this feature is gained.' })
  @prop({ type: () => APIReference, required: true })
  public level!: APIReference

  @Field(() => Class2024, { description: 'The class that gains this feature.' })
  @prop({ type: () => APIReference, required: true })
  public class!: APIReference

  @Field(() => Subclass2024, {
    nullable: true,
    description: 'The subclass that gains this feature, if applicable.'
  })
  @prop({ type: () => APIReference })
  public subclass?: APIReference

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type Feature2024Document = DocumentType<Feature2024>
const Feature2024Model = getModelForClass(Feature2024)

export default Feature2024Model
