import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { Choice } from '@/models/common/choice'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({
  description: 'A species representing a playable species in D&D 5e 2024.'
})
@srdModelOptions('2024-species')
export class Species2024 {
  @Field(() => String, { description: 'The unique identifier for this species (e.g., elf).' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'The name of the species (e.g., Elf).' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => String, { description: 'The URL of the API resource.' })
  @prop({ required: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'The creature type of this species (e.g., Humanoid).' })
  @prop({ required: true, type: () => String })
  public type!: string

  @Field(() => String, { nullable: true, description: 'The size of this species.' })
  @prop({ type: () => String })
  public size?: string

  @prop({ type: () => Choice })
  public size_options?: Choice

  @Field(() => Number, { description: 'The base walking speed of this species in feet.' })
  @prop({ required: true, type: () => Number })
  public speed!: number

  @Field(() => [APIReference], { nullable: true, description: 'Traits granted by this species.' })
  @prop({ type: () => [APIReference] })
  public traits?: APIReference[]

  @Field(() => [APIReference], {
    nullable: true,
    description: 'Subspecies available for this species.'
  })
  @prop({ type: () => [APIReference] })
  public subspecies?: APIReference[]

  @prop({ required: true, type: () => String })
  public updated_at!: string
}

export type SpeciesDocument = DocumentType<Species2024>
const Species2024Model = getModelForClass(Species2024)

export default Species2024Model
