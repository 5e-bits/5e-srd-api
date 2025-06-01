import { createUnionType } from 'type-graphql'

import { Feature } from '@/models/2014/feature'
import { Level } from '@/models/2014/level'

export const SubclassSpellPrerequisiteUnion = createUnionType({
  name: 'SubclassSpellPrerequisite',
  types: () => [Level, Feature] as const,
  resolveType: (value) => {
    if ('prof_bonus' in value || 'spellcasting' in value || 'features' in value) {
      return Level
    }
    if ('subclass' in value || 'feature_specific' in value || 'prerequisites' in value) {
      return Feature
    }

    console.warn('Could not reliably resolve type for SubclassSpellPrerequisiteUnion:', value)
    throw new Error('Could not resolve type for SubclassSpellPrerequisiteUnion')
  }
})
