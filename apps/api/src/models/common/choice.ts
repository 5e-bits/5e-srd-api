import { getModelForClass } from '@typegoose/typegoose'

import { APIReference } from '@/models/common/apiReference'
import { Damage } from '@/models/common/damage'
import { DifficultyClass } from '@/models/common/difficultyClass'
import { field, T } from '@/util/field'

// Option Set Classes
export class OptionSet {
  @field(T.String, { required: true, index: true, gql: false })
  public option_set_type!: 'equipment_category' | 'resource_list' | 'options_array'
}

export class EquipmentCategoryOptionSet extends OptionSet {
  @field(T.Model(() => APIReference), { required: true, index: true, gql: false })
  public equipment_category!: APIReference
}

export class ResourceListOptionSet extends OptionSet {
  @field(T.String, { required: true, index: true, gql: false })
  public resource_list_url!: string
}

export class OptionsArrayOptionSet extends OptionSet {
  @field(T.List(() => Option), { required: true, index: true, gql: false })
  public options!: Option[]
}

// Option Classes
export class Option {
  @field(T.String, { required: true, index: true, gql: false })
  public option_type!: string
}

export class ReferenceOption extends Option {
  @field(T.Model(() => APIReference), { required: true, index: true, gql: false })
  public item!: APIReference
}

export class ActionOption extends Option {
  @field(T.String, { required: true, index: true, gql: false })
  public action_name!: string

  @field(T.String, { required: true, index: true, gql: false })
  public count!: string

  @field(T.String, { required: true, index: true, gql: false })
  public type!: 'melee' | 'ranged' | 'ability' | 'magic' | 'special'

  @field(T.String, { index: true, gql: false })
  public notes?: string
}

export class MultipleOption extends Option {
  @field(T.List(() => Option), { required: true, index: true, gql: false })
  public items!: Option[]
}

export class StringOption extends Option {
  @field(T.String, { required: true, index: true, gql: false })
  public string!: string
}

export class IdealOption extends Option {
  @field(T.String, { required: true, index: true, gql: false })
  public desc!: string

  @field(T.List(() => APIReference), { required: true, index: true, gql: false })
  public alignments!: APIReference[]
}

export class CountedReferenceOption extends Option {
  @field(T.Model(() => Number), { required: true, index: true, gql: false })
  public count!: number

  @field(T.Model(() => APIReference), { required: true, index: true, gql: false })
  public of!: APIReference

  @field(
    T.List(() => ({
      type: { type: String, required: true },
      proficiency: { type: () => APIReference }
    })),
    { index: true, gql: false }
  )
  public prerequisites?: {
    type: 'proficiency'
    proficiency?: APIReference
  }[]
}

export class ScorePrerequisiteOption extends Option {
  @field(T.Model(() => APIReference), { required: true, index: true, gql: false })
  public ability_score!: APIReference

  @field(T.Model(() => Number), { required: true, index: true, gql: false })
  public minimum_score!: number
}

export class AbilityBonusOption extends Option {
  @field(T.Model(() => APIReference), { required: true, index: true, gql: false })
  public ability_score!: APIReference

  @field(T.Model(() => Number), { required: true, index: true, gql: false })
  public bonus!: number
}

export class BreathOption extends Option {
  @field(T.String, { required: true, index: true, gql: false })
  public name!: string

  @field(T.Model(() => DifficultyClass), { required: true, index: true, gql: false })
  public dc!: DifficultyClass

  @field(T.List(() => Damage), { index: true, gql: false })
  public damage?: Damage[]
}

export class DamageOption extends Option {
  @field(T.Model(() => APIReference), { required: true, index: true, gql: false })
  public damage_type!: APIReference

  @field(T.String, { required: true, index: true, gql: false })
  public damage_dice!: string

  @field(T.String, { index: true, gql: false })
  public notes?: string
}

export class Choice {
  @field(T.String, { required: false, gql: false })
  public desc?: string

  @field(T.Model(() => Number), { required: true, gql: false })
  public choose!: number

  @field(T.String, { required: true, gql: false })
  public type!: string

  @field(T.Model(() => OptionSet), { required: true, gql: false })
  public from!: OptionSet
}

export class ChoiceOption extends Option {
  @field(T.Model(() => Choice), { required: true, index: true, gql: false })
  public choice!: Choice
}

export class MoneyOption extends Option {
  @field(T.Model(() => Number), { required: true, index: true, gql: false })
  public count!: number

  @field(T.String, { required: true, index: true, gql: false })
  public unit!: string
}

// Export models
export const OptionSetModel = getModelForClass(OptionSet)
export const OptionModel = getModelForClass(Option)
export const ChoiceModel = getModelForClass(Choice)
