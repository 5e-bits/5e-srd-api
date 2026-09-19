import { createUnionType, Field, Int, ObjectType } from 'type-graphql'

import { Damage } from '@/models/common/damage'
import { DifficultyClass } from '@/models/common/difficultyClass'

// --- Damage Choice Types (2024) ---

@ObjectType({ description: 'A single damage option in a 2024 damage choice' })
export class DamageChoiceOption2024 {
  @Field(() => String)
  option_type!: string

  @Field(() => Damage)
  damage!: Damage
}

@ObjectType({ description: 'A set of damage options for a 2024 choice' })
export class DamageChoiceOptionSet2024 {
  @Field(() => String)
  option_set_type!: string

  @Field(() => [DamageChoiceOption2024])
  options!: DamageChoiceOption2024[]
}

@ObjectType({ description: 'A damage choice for a 2024 monster action' })
export class DamageChoice2024 {
  @Field(() => Int)
  choose!: number

  @Field(() => String)
  type!: string

  @Field(() => DamageChoiceOptionSet2024)
  from!: DamageChoiceOptionSet2024

  @Field(() => String, { nullable: true })
  desc?: string
}

export const DamageOrDamageChoice2024Union = createUnionType({
  name: 'DamageOrDamageChoice2024',
  types: () => [Damage, DamageChoice2024] as const,
  resolveType: (value: Damage | DamageChoice2024) => {
    if ('choose' in value) return DamageChoice2024
    return Damage
  }
})

// --- Breath Choice Types (2024) ---

@ObjectType({ description: 'A single breath option within a 2024 breath choice' })
export class BreathChoiceOption2024 {
  @Field(() => String)
  option_type!: string

  @Field(() => String)
  name!: string

  @Field(() => DifficultyClass)
  dc!: DifficultyClass

  @Field(() => [Damage], { nullable: true })
  damage?: Damage[]
}

@ObjectType({ description: 'A set of breath options for a 2024 choice' })
export class BreathChoiceOptionSet2024 {
  @Field(() => String)
  option_set_type!: string

  @Field(() => [BreathChoiceOption2024])
  options!: BreathChoiceOption2024[]
}

@ObjectType({ description: 'A breath choice for a 2024 monster action' })
export class BreathChoice2024 {
  @Field(() => Int)
  choose!: number

  @Field(() => String)
  type!: string

  @Field(() => BreathChoiceOptionSet2024)
  from!: BreathChoiceOptionSet2024

  @Field(() => String, { nullable: true })
  desc?: string
}

// --- Action Choice Types (2024) ---

@ObjectType({ description: 'A single action option within a 2024 action choice' })
export class ActionChoiceOption2024 {
  @Field(() => String)
  option_type!: string

  @Field(() => String)
  action_name!: string

  @Field(() => Int)
  count!: number

  @Field(() => String)
  type!: string

  @Field(() => String, { nullable: true })
  notes?: string
}

@ObjectType({ description: 'A multiple action option containing a set of 2024 actions' })
export class MultipleActionChoiceOption2024 {
  @Field(() => String)
  option_type!: string

  @Field(() => [ActionChoiceOption2024])
  items!: ActionChoiceOption2024[]
}

export const ActionOption2024Union = createUnionType({
  name: 'ActionOption2024Union',
  types: () => [ActionChoiceOption2024, MultipleActionChoiceOption2024] as const,
  resolveType(value) {
    if ('items' in value) return MultipleActionChoiceOption2024
    return ActionChoiceOption2024
  }
})

@ObjectType({ description: 'A set of action options for a 2024 choice' })
export class ActionChoiceOptionSet2024 {
  @Field(() => String)
  option_set_type!: string

  @Field(() => [ActionOption2024Union])
  options!: Array<ActionChoiceOption2024 | MultipleActionChoiceOption2024>
}

@ObjectType({ description: 'An action choice for a 2024 monster' })
export class ActionChoice2024 {
  @Field(() => Int)
  choose!: number

  @Field(() => String)
  type!: string

  @Field(() => ActionChoiceOptionSet2024)
  from!: ActionChoiceOptionSet2024

  @Field(() => String, { nullable: true })
  desc?: string
}
