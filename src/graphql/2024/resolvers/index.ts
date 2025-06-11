import { AbilityScoreResolver } from './abilityScore/resolver'
import { SkillResolver } from './skill/resolver'

const collectionResolvers = [AbilityScoreResolver, SkillResolver] as const
const fieldResolvers = [] as const

export const resolvers = [...collectionResolvers, ...fieldResolvers] as const
