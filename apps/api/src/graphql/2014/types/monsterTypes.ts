import { createUnionType, Field, Int, ObjectType } from 'type-graphql'

import {
  ArmorClassArmor,
  ArmorClassCondition,
  ArmorClassDex,
  ArmorClassNatural,
  ArmorClassSpell
} from '@/models/2014/monster'
import { Damage } from '@/models/common/damage'
import { DifficultyClass } from '@/models/common/difficultyClass'

// --- Breath Choice Types ---
@ObjectType({ description: 'A single breath option within a breath choice' })
export class BreathChoiceOption {
  @Field(() => String, { description: 'The type of option (e.g., breath).' })
  option_type!: string

  @Field(() => String, { description: 'The name of the breath option.' })
  name!: string

  @Field(() => DifficultyClass, { description: 'The difficulty class for the breath.' })
  dc!: DifficultyClass

  @Field(() => [Damage], { nullable: true, description: 'The damage dealt by the breath.' })
  damage?: Damage[]
}

@ObjectType({ description: 'A set of breath options to choose from' })
export class BreathChoiceOptionSet {
  @Field(() => String, { description: 'The type of option set.' })
  option_set_type!: string

  @Field(() => [BreathChoiceOption], { description: 'The available breath options.' })
  options!: BreathChoiceOption[]
}

@ObjectType({ description: 'A choice of breath options for a monster action' })
export class BreathChoice {
  @Field(() => Int, { description: 'Number of breath options to choose.' })
  choose!: number

  @Field(() => String, { description: 'Type of breath options to choose from.' })
  type!: string

  @Field(() => BreathChoiceOptionSet, { description: 'The options to choose from.' })
  from!: BreathChoiceOptionSet

  @Field(() => String, { nullable: true, description: 'Description of the breath choice.' })
  desc?: string
}

// --- Damage Choice Types ---
@ObjectType({ description: 'A single damage option in a damage choice' })
export class DamageChoiceOption {
  @Field(() => String, { description: 'The type of option.' })
  option_type!: string

  @Field(() => Damage, { description: 'The damage for this option.' })
  damage!: Damage
}

@ObjectType({ description: 'A set of damage options' })
export class DamageChoiceOptionSet {
  @Field(() => String, { description: 'The type of option set.' })
  option_set_type!: string

  @Field(() => [DamageChoiceOption], { description: 'The options in this set.' })
  options!: DamageChoiceOption[]
}

@ObjectType({ description: 'A choice of damage options' })
export class DamageChoice {
  @Field(() => Number, { description: 'The number of options to choose.' })
  choose!: number

  @Field(() => String, { description: 'The type of choice.' })
  type!: string

  @Field(() => DamageChoiceOptionSet, { description: 'The options to choose from.' })
  from!: DamageChoiceOptionSet

  @Field(() => String, { nullable: true, description: 'The description of the choice.' })
  desc?: string
}

// --- Action Option Choice Types ---
@ObjectType({ description: 'A single action option within a choice' })
export class ActionChoiceOption {
  @Field(() => String, { description: 'The type of option.' })
  option_type!: string

  @Field(() => String, { description: 'The name of the action.' })
  action_name!: string

  @Field(() => Int, { description: 'Number of times the action can be used.' })
  count!: number

  @Field(() => String, { description: 'The type of action.' })
  type!: 'melee' | 'ranged' | 'ability' | 'magic'

  @Field(() => String, { nullable: true, description: 'Additional notes about the action.' })
  notes?: string
}

@ObjectType({ description: 'A multiple action option containing a set of actions' })
export class MultipleActionChoiceOption {
  @Field(() => String, { description: 'The type of option.' })
  option_type!: string

  @Field(() => [ActionChoiceOption], { description: 'The set of actions in this option.' })
  items!: ActionChoiceOption[]
}

@ObjectType({ description: 'A set of action options to choose from' })
export class ActionChoiceOptionSet {
  @Field(() => String, { description: 'The type of option set.' })
  option_set_type!: string

  @Field(() => [ActionOptionUnion], { description: 'The available options.' })
  options!: Array<ActionChoiceOption | MultipleActionChoiceOption>
}

@ObjectType({ description: 'A choice of actions for a monster' })
export class ActionChoice {
  @Field(() => Int, { description: 'Number of actions to choose.' })
  choose!: number

  @Field(() => String, { description: 'Type of actions to choose from.' })
  type!: string

  @Field(() => ActionChoiceOptionSet, { description: 'The options to choose from.' })
  from!: ActionChoiceOptionSet

  @Field(() => String, { nullable: true, description: 'Description of the action choice.' })
  desc?: string
}

// --- Unions ---

export const ActionOptionUnion = createUnionType({
  name: 'ActionOptionUnion',
  types: () => [ActionChoiceOption, MultipleActionChoiceOption],
  resolveType(value) {
    if ('items' in value) {
      return MultipleActionChoiceOption
    }
    return ActionChoiceOption
  }
})

export const DamageOrDamageChoiceUnion = createUnionType({
  name: 'DamageOrDamageChoice',
  types: () => [Damage, DamageChoice],
  resolveType: (value: Damage | DamageChoice) => {
    if ('choose' in value) {
      return DamageChoice
    }
    return Damage
  }
})

export const MonsterArmorClassUnion = createUnionType({
  name: 'MonsterArmorClass',
  types: () =>
    [
      ArmorClassDex,
      ArmorClassNatural,
      ArmorClassArmor,
      ArmorClassSpell,
      ArmorClassCondition
    ] as const,
  resolveType: (value: any) => {
    if (value == null || typeof value.type !== 'string') {
      console.warn('Cannot resolve MonsterArmorClass: type field is missing or invalid', value)
      throw new Error('Cannot resolve MonsterArmorClass: type field is missing or invalid')
    }
    switch (value.type) {
      case 'dex':
        return ArmorClassDex
      case 'natural':
        return ArmorClassNatural
      case 'armor':
        return ArmorClassArmor
      case 'spell':
        return ArmorClassSpell
      case 'condition':
        return ArmorClassCondition
      default:
        console.warn('Could not resolve type for MonsterArmorClassUnion:', value)
        throw new Error(
          'Could not resolve type for MonsterArmorClassUnion: Unknown type ' + value.type
        )
    }
  }
})
