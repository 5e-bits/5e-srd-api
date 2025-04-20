import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { APIReference, Choice } from './common'
import { srdModelOptions } from '@/util/modelOptions'

// EXPORT local classes/types needed by factories
export class Equipment {
  @prop({ type: () => APIReference })
  public equipment!: APIReference

  @prop({ required: true, index: true, type: () => Number })
  public quantity!: number
}

export class SpellcastingInfo {
  @prop({ required: true, index: true, type: () => [String] })
  public desc!: string[]

  @prop({ required: true, index: true, type: () => String })
  public name!: string
}

export class Spellcasting {
  @prop({ type: () => [SpellcastingInfo] })
  public info!: SpellcastingInfo[]

  @prop({ required: true, index: true, type: () => Number })
  public level!: number

  @prop({ type: () => APIReference })
  public spellcasting_ability!: APIReference
}

export class MultiClassingPrereq {
  @prop({ type: () => APIReference })
  public ability_score!: APIReference

  @prop({ required: true, index: true, type: () => Number })
  public minimum_score!: number
}

export class MultiClassing {
  @prop({ type: () => [MultiClassingPrereq], default: undefined })
  public prerequisites?: MultiClassingPrereq[]

  @prop({ type: () => Choice, default: undefined })
  public prerequisite_options?: Choice

  @prop({ type: () => [APIReference], default: undefined })
  public proficiencies?: APIReference[]

  @prop({ type: () => [Choice], default: undefined })
  public proficiency_choices?: Choice[]
}

@srdModelOptions('2014-classes')
export class Class {
  @prop({ required: true, index: true, type: () => String })
  public class_levels!: string

  @prop({ type: () => MultiClassing })
  public multi_classing!: MultiClassing

  @prop({ required: true, index: true, type: () => Number })
  public hit_die!: number

  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @prop({ type: () => [APIReference] })
  public proficiencies!: APIReference[]

  @prop({ type: () => [Choice] })
  public proficiency_choices!: Choice[]

  @prop({ type: () => [APIReference] })
  public saving_throws!: APIReference[]

  @prop({ type: () => Spellcasting })
  public spellcasting?: Spellcasting

  @prop({ required: true, index: true, type: () => String })
  public spells!: string

  @prop({ type: () => [Equipment] })
  public starting_equipment!: Equipment[]

  @prop({ type: () => [Choice] })
  public starting_equipment_options!: Choice[]

  @prop({ type: () => [APIReference] })
  public subclasses!: APIReference[]

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type ClassDocument = DocumentType<Class>
const ClassModel = getModelForClass(Class)
export default ClassModel
