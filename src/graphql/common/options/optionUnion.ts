import { createUnionType } from 'type-graphql'
import * as OptionTypes from './optionTypes' // Import from the barrel file

export const GraphQLOption = createUnionType({
  name: 'GraphQLOption', // the name of the GraphQL union
  types: () =>
    [
      OptionTypes.ReferenceOptionObject,
      OptionTypes.ActionOptionObject,
      OptionTypes.MultipleOptionObject,
      OptionTypes.StringOptionObject,
      OptionTypes.IdealOptionObject,
      OptionTypes.CountedReferenceOptionObject,
      OptionTypes.ScorePrerequisiteOptionObject,
      OptionTypes.AbilityBonusOptionObject,
      OptionTypes.BreathOptionObject,
      OptionTypes.DamageOptionObject,
      OptionTypes.ChoiceOptionObject
    ] as const,
  // determine type based on 'option_type' property
  resolveType: (value) => {
    switch (value.option_type) {
      case 'ReferenceOption':
        return OptionTypes.ReferenceOptionObject
      case 'ActionOption':
        return OptionTypes.ActionOptionObject
      case 'MultipleOption':
        return OptionTypes.MultipleOptionObject
      case 'StringOption':
        return OptionTypes.StringOptionObject
      case 'IdealOption':
        return OptionTypes.IdealOptionObject
      case 'CountedReferenceOption':
        return OptionTypes.CountedReferenceOptionObject
      case 'ScorePrerequisiteOption':
        return OptionTypes.ScorePrerequisiteOptionObject
      case 'AbilityBonusOption':
        return OptionTypes.AbilityBonusOptionObject
      case 'BreathOption':
        return OptionTypes.BreathOptionObject
      case 'DamageOption':
        return OptionTypes.DamageOptionObject
      case 'ChoiceOption':
        return OptionTypes.ChoiceOptionObject
      default:
        return undefined
    }
  }
})
