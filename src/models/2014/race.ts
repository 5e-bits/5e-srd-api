import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { APIReference, Choice } from '@/models/2014/common'
import { srdModelOptions } from '@/util/modelOptions'

export class RaceAbilityBonus {
  @prop({ type: () => APIReference, required: true })
  public ability_score!: APIReference

  @prop({ required: true, index: true, type: () => Number })
  public bonus!: number
}

@srdModelOptions('2014-races')
export class Race {
  @prop({ type: () => Choice })
  public ability_bonus_options?: Choice

  @prop({ type: () => [RaceAbilityBonus], required: true })
  public ability_bonuses!: RaceAbilityBonus[]

  @prop({ required: true, index: true, type: () => String })
  public age!: string

  @prop({ required: true, index: true, type: () => String })
  public alignment!: string

  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @prop({ required: true, index: true, type: () => String })
  public language_desc!: string

  @prop({ type: () => Choice, required: true })
  public language_options!: Choice

  @prop({ type: () => [APIReference], required: true })
  public languages!: APIReference[]

  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @prop({ required: true, index: true, type: () => String })
  public size!: string

  @prop({ required: true, index: true, type: () => String })
  public size_description!: string

  @prop({ required: true, index: true, type: () => Number })
  public speed!: number

  @prop({ type: () => [APIReference] })
  public starting_proficiencies?: APIReference[]

  @prop({ type: () => Choice })
  public starting_proficiency_options?: Choice

  @prop({ type: () => [APIReference] })
  public subraces?: APIReference[]

  @prop({ type: () => [APIReference] })
  public traits?: APIReference[]

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type RaceDocument = DocumentType<Race>
const RaceModel = getModelForClass(Race)

export default RaceModel
