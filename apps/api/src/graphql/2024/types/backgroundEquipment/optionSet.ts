import { createUnionType, Field, ObjectType } from 'type-graphql'

import { CountedReferenceOption2024, MoneyOption2024, MultipleItemsOption2024 } from './common'

@ObjectType({ description: 'A set of explicitly listed equipment options.' })
export class EquipmentOptionSet2024 {
  @Field(() => String, { description: "Indicates the type of option set, e.g., 'options_array'." })
  option_set_type!: string

  @Field(() => [EquipmentOptionUnion2024], { description: 'A list of specific equipment options.' })
  options!: Array<typeof EquipmentOptionUnion2024>
}

export const EquipmentOptionUnion2024 = createUnionType({
  name: 'EquipmentOptionUnion2024',
  description: 'An option within a background equipment choice.',
  types: () => [CountedReferenceOption2024, MultipleItemsOption2024, MoneyOption2024] as const,
  resolveType(value) {
    if (value.option_type === 'counted_reference') return CountedReferenceOption2024
    if (value.option_type === 'multiple') return MultipleItemsOption2024
    if (value.option_type === 'money') return MoneyOption2024
    return undefined
  }
})
