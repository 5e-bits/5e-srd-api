import { AbilityScoreResolver } from './abilityScore/resolver'
import { AlignmentResolver } from './alignment/resolver'
import { ConditionResolver } from './condition/resolver'
import { SkillResolver } from './skill/resolver'

const collectionResolvers = [
  AbilityScoreResolver,
  AlignmentResolver,
  ConditionResolver,
  SkillResolver
] as const
const fieldResolvers = [] as const

export const resolvers = [...collectionResolvers, ...fieldResolvers] as const
