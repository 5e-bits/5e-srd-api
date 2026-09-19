import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { Choice } from '@/models/common/choice'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({
  description: 'A trait granted by a species or subspecies in D&D 5e 2024.'
})
@srdModelOptions('2024-traits')
export class Trait2024 {
  @Field(() => String, { description: 'The unique identifier for this trait (e.g., darkvision).' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'The name of the trait (e.g., Darkvision).' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => String, { description: 'The URL of the API resource.' })
  @prop({ required: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'A description of the trait.' })
  @prop({ required: true, type: () => String })
  public description!: string

  @Field(() => [APIReference], {
    description: 'The species that grant this trait.'
  })
  @prop({ type: () => [APIReference], required: true })
  public species!: APIReference[]

  @Field(() => [APIReference], {
    nullable: true,
    description: 'The subspecies that grant this trait.'
  })
  @prop({ type: () => [APIReference] })
  public subspecies?: APIReference[]

  @prop({ type: () => Choice })
  public proficiency_choices?: Choice

  @Field(() => Number, { nullable: true, description: 'Speed override granted by this trait.' })
  @prop({ type: () => Number })
  public speed?: number

  @prop({ required: true, type: () => String })
  public updated_at!: string
}

export type TraitDocument = DocumentType<Trait2024>
const Trait2024Model = getModelForClass(Trait2024)

export default Trait2024Model
