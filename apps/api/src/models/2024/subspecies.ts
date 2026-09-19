import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({
  description: 'A subspecies trait reference including the level at which it is gained.'
})
export class SubspeciesTrait {
  @Field(() => String, { description: 'The unique identifier for this trait.' })
  @prop({ required: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'The name of this trait.' })
  @prop({ required: true, type: () => String })
  public name!: string

  @Field(() => String, { description: 'The URL of the trait resource.' })
  @prop({ required: true, type: () => String })
  public url!: string

  @Field(() => Number, { description: 'The character level at which this trait is gained.' })
  @prop({ required: true, type: () => Number })
  public level!: number
}

@ObjectType({
  description: 'A subspecies representing a variant of a playable species in D&D 5e 2024.'
})
@srdModelOptions('2024-subspecies')
export class Subspecies2024 {
  @Field(() => String, { description: 'The unique identifier for this subspecies.' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'The name of the subspecies.' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => String, { description: 'The URL of the API resource.' })
  @prop({ required: true, type: () => String })
  public url!: string

  @Field(() => APIReference, { description: 'The parent species of this subspecies.' })
  @prop({ type: () => APIReference, required: true })
  public species!: APIReference

  @Field(() => [SubspeciesTrait], { description: 'Traits granted by this subspecies.' })
  @prop({ type: () => [SubspeciesTrait], required: true })
  public traits!: SubspeciesTrait[]

  @Field(() => APIReference, {
    nullable: true,
    description: 'The damage type associated with this subspecies (Dragonborn only).'
  })
  @prop({ type: () => APIReference })
  public damage_type?: APIReference

  @prop({ required: true, type: () => String })
  public updated_at!: string
}

export type SubspeciesDocument = DocumentType<Subspecies2024>
const Subspecies2024Model = getModelForClass(Subspecies2024)

export default Subspecies2024Model
