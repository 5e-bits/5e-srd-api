import { createUnionType,Field, ObjectType } from 'type-graphql'

import { EquipmentCategory } from '@/models/2014/equipmentCategory'

import {
  CountedReferenceOption,
  EquipmentCategoryChoiceOption,
  MultipleItemsOption} from './common'

@ObjectType({
  description: 'A set of equipment choices derived directly from an equipment category.'
})
export class EquipmentCategorySet {
  @Field(() => String, {
    description: "Indicates the type of option set, e.g., 'equipment_category'."
  })
  option_set_type!: string

  @Field(() => EquipmentCategory, {
    description: 'The equipment category to choose from.'
  })
  equipment_category!: EquipmentCategory
}

@ObjectType({ description: 'A set of explicitly listed equipment options.' })
export class EquipmentOptionSet {
  @Field(() => String, { description: "Indicates the type of option set, e.g., 'options_array'." })
  option_set_type!: string

  @Field(() => [EquipmentOptionUnion], { description: 'A list of specific equipment options.' })
  options!: Array<CountedReferenceOption | EquipmentCategoryChoiceOption | MultipleItemsOption>
}

// Union for the `from` field of StartingEquipmentChoice
export const StartingEquipmentFromUnion = createUnionType({
  name: 'StartingEquipmentFromUnion',
  types: () => [EquipmentCategorySet, EquipmentOptionSet] as const,
  resolveType: (value) => {
    if (value.option_set_type === 'equipment_category') {
      return EquipmentCategorySet
    }
    if (value.option_set_type === 'options_array') {
      return EquipmentOptionSet
    }
    return undefined
  }
})

// Union for items within EquipmentOptionSet.options
export const EquipmentOptionUnion = createUnionType({
  name: 'EquipmentOptionUnion',
  types: () =>
    [CountedReferenceOption, EquipmentCategoryChoiceOption, MultipleItemsOption] as const,
  resolveType: (value) => {
    if (value.option_type === 'counted_reference') {
      return CountedReferenceOption
    }
    if (value.option_type === 'choice' || value.option_type === 'equipment_category_choice') {
      return EquipmentCategoryChoiceOption
    }
    if (value.option_type === 'multiple') {
      return MultipleItemsOption
    }
    return undefined
  }
})
