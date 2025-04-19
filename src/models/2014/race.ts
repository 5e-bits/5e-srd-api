import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { APIReference, Choice } from '@/models/2014/common'
import { srdModelOptions } from '@/util/modelOptions'
class RaceAbilityBonus {
  @prop({ type: () => APIReference, required: true })
  public ability_score!: APIReference

  @prop({ required: true, index: true })
  public bonus!: number
}

@srdModelOptions('2014-races')
export class Race {
  @prop({ type: () => Choice })
  public ability_bonus_options?: Choice

  @prop({ type: () => [RaceAbilityBonus], required: true })
  public ability_bonuses!: RaceAbilityBonus[]

  @prop({ required: true, index: true })
  public age!: string

  @prop({ required: true, index: true })
  public alignment!: string

  @prop({ required: true, index: true })
  public index!: string

  @prop({ required: true, index: true })
  public language_desc!: string

  @prop({ type: () => Choice, required: true })
  public language_options!: Choice

  @prop({ type: () => [APIReference], required: true })
  public languages!: APIReference[]

  @prop({ required: true, index: true })
  public name!: string

  @prop({ required: true, index: true })
  public size!: string

  @prop({ required: true, index: true })
  public size_description!: string

  @prop({ required: true, index: true })
  public speed!: number

  @prop({ type: () => [APIReference] })
  public starting_proficiencies?: APIReference[]

  @prop({ type: () => Choice })
  public starting_proficiency_options?: Choice

  @prop({ type: () => [APIReference] })
  public subraces?: APIReference[]

  @prop({ type: () => [APIReference] })
  public traits?: APIReference[]

  @prop({ required: true, index: true })
  public url!: string

  @prop({ required: true, index: true })
  public updated_at!: string
}

export type RaceDocument = DocumentType<Race>
const RaceModel = getModelForClass(Race)

export default RaceModel
