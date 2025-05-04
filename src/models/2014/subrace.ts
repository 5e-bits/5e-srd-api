import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { APIReference, Choice } from '@/models/2014/common'
import { srdModelOptions } from '@/util/modelOptions'

export class SubraceAbilityBonus {
  @prop({ type: () => APIReference, required: true })
  public ability_score!: APIReference

  @prop({ required: true, index: true, type: () => Number })
  public bonus!: number
}

@srdModelOptions('2014-subraces')
export class Subrace {
  @prop({ type: () => [SubraceAbilityBonus], required: true })
  public ability_bonuses!: SubraceAbilityBonus[]

  @prop({ required: true, index: true, type: () => String })
  public desc!: string

  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @prop({ type: () => [APIReference] })
  public languages?: APIReference[]

  @prop({ type: () => Choice })
  public language_options?: Choice

  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @prop({ type: () => APIReference, required: true })
  public race!: APIReference

  @prop({ type: () => [APIReference] })
  public racial_traits!: APIReference[]

  @prop({ type: () => [APIReference] })
  public starting_proficiencies?: APIReference[]

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type SubraceDocument = DocumentType<Subrace>
const SubraceModel = getModelForClass(Subrace)

export default SubraceModel
