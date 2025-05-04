// This file will export an array of all resolver classes
import { AlignmentResolver } from './alignmentResolver'
import { ConditionResolver } from './conditionResolver'
import { DamageTypeResolver } from './damageTypeResolver'

export const resolvers = [AlignmentResolver, ConditionResolver, DamageTypeResolver] as const

// For now, export an empty array until resolvers are created
// export const resolvers: Function[] = []; // Original empty array
