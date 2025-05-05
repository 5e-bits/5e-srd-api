import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { APIReference, Choice } from '@/models/2014/common'
import { srdModelOptions } from '@/util/modelOptions'
import { ObjectType, Field, Int } from 'type-graphql'

@ObjectType({ description: 'Bonus to an ability score provided by a subrace.' })
export class SubraceAbilityBonus {
  // TODO: Pass 2 - Implement reference resolver
  @prop({ type: () => APIReference, required: true })
  public ability_score!: APIReference

  @Field(() => Int, { description: 'The bonus value to the ability score.' })
  @prop({ required: true, index: true, type: () => Number })
  public bonus!: number
}

@ObjectType({ description: 'A subrace representing a specific heritage within a larger race.' })
@srdModelOptions('2014-subraces')
export class Subrace {
  @Field(() => [SubraceAbilityBonus], {
    description: 'Ability score bonuses granted by this subrace.'
  })
  @prop({ type: () => [SubraceAbilityBonus], required: true })
  public ability_bonuses!: SubraceAbilityBonus[]

  @Field(() => String, { description: 'A description of the subrace.' })
  @prop({ required: true, index: true, type: () => String })
  public desc!: string

  @Field(() => String, { description: 'The unique identifier for this subrace (e.g., high-elf).' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  // TODO: Pass 2 - Implement reference resolver
  @prop({ type: () => [APIReference] })
  public languages?: APIReference[]

  // TODO: Pass 3 - Implement choice resolver
  @prop({ type: () => Choice })
  public language_options?: Choice

  @Field(() => String, { description: 'The name of the subrace (e.g., High Elf).' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  // TODO: Pass 2 - Implement reference resolver
  @prop({ type: () => APIReference, required: true })
  public race!: APIReference

  // TODO: Pass 2 - Implement reference resolver
  @prop({ type: () => [APIReference] })
  public racial_traits!: APIReference[]

  // TODO: Pass 2 - Implement reference resolver
  @prop({ type: () => [APIReference] })
  public starting_proficiencies?: APIReference[]

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type SubraceDocument = DocumentType<Subrace>
const SubraceModel = getModelForClass(Subrace)

export default SubraceModel
