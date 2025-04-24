import { createUnionType } from 'type-graphql'
import * as OptionSetTypes from './optionSetTypes' // Import from the barrel file

export const GraphQLOptionSet = createUnionType({
  name: 'GraphQLOptionSet', // the name of the GraphQL union
  types: () =>
    [
      OptionSetTypes.EquipmentCategoryOptionSetObject,
      OptionSetTypes.ResourceListOptionSetObject,
      OptionSetTypes.OptionsArrayOptionSetObject
    ] as const,
  // determine type based on 'option_set_type' property
  resolveType: (value) => {
    switch (value.option_set_type) {
      case 'equipment_category':
        return OptionSetTypes.EquipmentCategoryOptionSetObject
      case 'resource_list':
        return OptionSetTypes.ResourceListOptionSetObject
      case 'options_array':
        return OptionSetTypes.OptionsArrayOptionSetObject
      default:
        return undefined
    }
  }
})
