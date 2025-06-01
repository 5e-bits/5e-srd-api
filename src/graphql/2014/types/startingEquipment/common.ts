import { createUnionType, Field, Int, ObjectType } from 'type-graphql'

import { Equipment } from '@/models/2014/equipment'
import { EquipmentCategory } from '@/models/2014/equipmentCategory'
import { Proficiency } from '@/models/2014/proficiency'

@ObjectType({
  description: 'A prerequisite for an equipment option, typically requiring a specific proficiency.'
})
export class ProficiencyPrerequisite {
  @Field(() => String, { description: "The type of prerequisite, e.g., 'proficiency'." })
  type!: string

  @Field(() => Proficiency, {
    description: 'The specific proficiency required.'
  })
  proficiency!: Proficiency
}

@ObjectType({ description: 'Represents a specific piece of equipment with a quantity.' })
export class CountedReferenceOption {
  @Field(() => String, { description: "The type of this option, e.g., 'counted_reference'." })
  option_type!: string // This helps in discriminating union types if used directly

  @Field(() => Int, { description: 'The quantity of the equipment.' })
  count!: number

  @Field(() => Equipment, { description: 'The referenced equipment item.' })
  of!: Equipment

  @Field(() => [ProficiencyPrerequisite], {
    nullable: true,
    description: 'Prerequisites for choosing this option.'
  })
  prerequisites?: ProficiencyPrerequisite[]
}

// Definition for EquipmentCategorySet, moved from optionSet.ts and placed before its usage
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

// Describes the details of a choice that is specifically from an equipment category.
// This is used inside EquipmentCategoryChoiceOption.
@ObjectType({ description: 'Details of a choice limited to an equipment category.' })
export class EquipmentCategoryChoice {
  @Field(() => Int, { description: 'Number of items to choose from the category.' })
  choose!: number

  @Field(() => String, { nullable: true, description: 'An optional description for this choice.' })
  desc?: string

  @Field(() => String, { description: "Type of choice, e.g., 'equipment'." })
  type!: string

  @Field(() => EquipmentCategorySet, {
    description: 'The equipment category to choose from.'
  })
  from!: EquipmentCategorySet
}

@ObjectType({ description: 'An option that represents a choice from a single equipment category.' })
export class EquipmentCategoryChoiceOption {
  @Field(() => String, {
    description: "The type of this option, e.g., 'choice' or 'equipment_category_choice'."
  })
  option_type!: string // Data might say 'choice', resolver will map to this type if structure matches

  @Field(() => EquipmentCategoryChoice, {
    description: 'The details of the choice from an equipment category.'
  })
  choice!: EquipmentCategoryChoice
}

// This union represents the types of items that can be part of a 'multiple' bundle.
export const MultipleItemUnion = createUnionType({
  name: 'MultipleItemUnion',
  types: () => [CountedReferenceOption, EquipmentCategoryChoiceOption] as const,
  resolveType: (value) => {
    if (value.option_type === 'counted_reference') {
      return CountedReferenceOption
    }
    if (value.option_type === 'choice' || value.option_type === 'equipment_category_choice') {
      return EquipmentCategoryChoiceOption
    }
    return undefined
  }
})

@ObjectType({
  description: 'Represents a bundle of multiple equipment items or equipment category choices.'
})
export class MultipleItemsOption {
  @Field(() => String, { description: "The type of this option, e.g., 'multiple'." })
  option_type!: string

  @Field(() => [MultipleItemUnion], {
    description: 'The list of items or category choices included in this bundle.'
  })
  items!: Array<CountedReferenceOption | EquipmentCategoryChoiceOption>
}
