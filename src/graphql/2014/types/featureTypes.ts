import { createUnionType } from 'type-graphql'

import { FeaturePrerequisite, LevelPrerequisite, SpellPrerequisite } from '@/models/2014/feature'

export const FeaturePrerequisiteUnion = createUnionType({
  name: 'FeaturePrerequisiteUnion',
  types: () => [LevelPrerequisite, FeaturePrerequisite, SpellPrerequisite] as const,
  resolveType: (value) => {
    if (value.type === 'level') {
      return LevelPrerequisite
    }
    if (value.type === 'feature') {
      return FeaturePrerequisite
    }
    if (value.type === 'spell') {
      return SpellPrerequisite
    }
    console.warn('Could not resolve type for FeaturePrerequisiteUnion:', value)
    throw new Error('Could not resolve type for FeaturePrerequisiteUnion')
  }
})
