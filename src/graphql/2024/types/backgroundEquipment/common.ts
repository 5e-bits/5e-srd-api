import { createUnionType, Field, Int, ObjectType } from 'type-graphql'

import { EquipmentCategory2024 } from '@/models/2024/equipmentCategory'

import { AnyEquipment } from '../../common/unions'

// --- Money Option ---

@ObjectType({ description: 'A money option within an equipment choice.' })
export class MoneyOption2024 {
  @Field(() => String, { description: "The type of this option, e.g., 'money'." })
  option_type!: string

  @Field(() => Int, { description: 'Amount of money.' })
  count!: number

  @Field(() => String, { description: "Currency unit (e.g., 'gp')." })
  unit!: string
}

// --- Counted Reference Option ---

@ObjectType({ description: 'A counted reference to a specific piece of equipment.' })
export class CountedReferenceOption2024 {
  @Field(() => String, { description: "The type of this option, e.g., 'counted_reference'." })
  option_type!: string

  @Field(() => Int, { description: 'Quantity of the referenced item.' })
  count!: number

  @Field(() => AnyEquipment, { description: 'The referenced equipment item.' })
  of!: typeof AnyEquipment
}

// --- Equipment Category Set (used inside ChoiceItemOption2024) ---

@ObjectType({ description: 'A set of equipment choices derived from an equipment category.' })
export class EquipmentCategorySet2024 {
  @Field(() => String, {
    description: "Indicates the type of option set, e.g., 'equipment_category'."
  })
  option_set_type!: string

  @Field(() => EquipmentCategory2024, { description: 'The equipment category to choose from.' })
  equipment_category!: EquipmentCategory2024
}

@ObjectType({ description: 'Details of a nested choice limited to an equipment category.' })
export class EquipmentCategoryChoice2024 {
  @Field(() => Int, { description: 'Number of items to choose from the category.' })
  choose!: number

  @Field(() => String, { description: "Type of choice, e.g., 'equipment'." })
  type!: string

  @Field(() => EquipmentCategorySet2024, { description: 'The equipment category to choose from.' })
  from!: EquipmentCategorySet2024
}

@ObjectType({ description: 'An option representing a choice from a single equipment category.' })
export class ChoiceItemOption2024 {
  @Field(() => String, { description: "The type of this option, e.g., 'choice'." })
  option_type!: string

  @Field(() => EquipmentCategoryChoice2024, {
    description: 'The nested equipment category choice.'
  })
  choice!: EquipmentCategoryChoice2024
}

// --- Multiple Items Option ---

export const MultipleItemUnion2024 = createUnionType({
  name: 'MultipleItemUnion2024',
  description: 'An item within a multiple-items equipment option.',
  types: () => [CountedReferenceOption2024, MoneyOption2024, ChoiceItemOption2024] as const,
  resolveType(value) {
    if (value.option_type === 'counted_reference') return CountedReferenceOption2024
    if (value.option_type === 'money') return MoneyOption2024
    if (value.option_type === 'choice') return ChoiceItemOption2024
    return undefined
  }
})

@ObjectType({ description: 'A bundle of multiple equipment items.' })
export class MultipleItemsOption2024 {
  @Field(() => String, { description: "The type of this option, e.g., 'multiple'." })
  option_type!: string

  @Field(() => [MultipleItemUnion2024], { description: 'The items included in this bundle.' })
  items!: Array<typeof MultipleItemUnion2024>
}
