import { getModelForClass, prop } from '@typegoose/typegoose'

import { APIReference } from '@/models/common/apiReference'
import { Damage } from '@/models/common/damage'
import { DifficultyClass } from '@/models/common/difficultyClass'

// Option Set Classes
export class OptionSet {
  @prop({ required: true, index: true, type: () => String })
  public option_set_type!: 'equipment_category' | 'resource_list' | 'options_array'
}

export class EquipmentCategoryOptionSet extends OptionSet {
  @prop({ type: () => APIReference, required: true, index: true })
  public equipment_category!: APIReference
}

export class ResourceListOptionSet extends OptionSet {
  @prop({ required: true, index: true, type: () => String })
  public resource_list_url!: string
}

export class OptionsArrayOptionSet extends OptionSet {
  @prop({ type: () => [Option], required: true, index: true })
  public options!: Option[]
}

// Option Classes
export class Option {
  @prop({ required: true, index: true, type: () => String })
  public option_type!: string
}

export class ReferenceOption extends Option {
  @prop({ type: () => APIReference, required: true, index: true })
  public item!: APIReference
}

export class ActionOption extends Option {
  @prop({ required: true, index: true, type: () => String })
  public action_name!: string

  @prop({ required: true, index: true, type: () => Number })
  public count!: number | string

  @prop({ required: true, index: true, type: () => String })
  public type!: 'melee' | 'ranged' | 'ability' | 'magic'

  @prop({ index: true, type: () => String })
  public notes?: string
}

export class MultipleOption extends Option {
  @prop({ type: () => [Option], required: true, index: true })
  public items!: Option[]
}

export class StringOption extends Option {
  @prop({ required: true, index: true, type: () => String })
  public string!: string
}

export class IdealOption extends Option {
  @prop({ required: true, index: true, type: () => String })
  public desc!: string

  @prop({ type: () => [APIReference], required: true, index: true })
  public alignments!: APIReference[]
}

export class CountedReferenceOption extends Option {
  @prop({ required: true, index: true, type: () => Number })
  public count!: number

  @prop({ type: () => APIReference, required: true, index: true })
  public of!: APIReference

  @prop({
    type: () => [
      {
        type: { type: String, required: true },
        proficiency: { type: () => APIReference }
      }
    ],
    index: true
  })
  public prerequisites?: {
    type: 'proficiency'
    proficiency?: APIReference
  }[]
}

export class ScorePrerequisiteOption extends Option {
  @prop({ type: () => APIReference, required: true, index: true })
  public ability_score!: APIReference

  @prop({ required: true, index: true, type: () => Number })
  public minimum_score!: number
}

export class AbilityBonusOption extends Option {
  @prop({ type: () => APIReference, required: true, index: true })
  public ability_score!: APIReference

  @prop({ required: true, index: true, type: () => Number })
  public bonus!: number
}

export class BreathOption extends Option {
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @prop({ type: () => DifficultyClass, required: true, index: true })
  public dc!: DifficultyClass

  @prop({ type: () => [Damage], index: true })
  public damage?: Damage[]
}

export class DamageOption extends Option {
  @prop({ type: () => APIReference, required: true, index: true })
  public damage_type!: APIReference

  @prop({ required: true, index: true, type: () => String })
  public damage_dice!: string

  @prop({ index: true, type: () => String })
  public notes?: string
}

export class Choice {
  @prop({ type: () => String, required: true })
  public desc!: string

  @prop({ type: () => Number, required: true })
  public choose!: number

  @prop({ type: () => String, required: true })
  public type!: string

  @prop({ type: () => OptionSet, required: true })
  public from!: OptionSet
}

export class ChoiceOption extends Option {
  @prop({ type: () => Choice, required: true, index: true })
  public choice!: Choice
}

// Export models
export const OptionSetModel = getModelForClass(OptionSet)
export const OptionModel = getModelForClass(Option)
export const ChoiceModel = getModelForClass(Choice)
