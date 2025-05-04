// This file will export an array of all resolver classes
import { AlignmentResolver } from './alignmentResolver'
import { ConditionResolver } from './conditionResolver'

export const resolvers = [AlignmentResolver, ConditionResolver] as const

// For now, export an empty array until resolvers are created
// export const resolvers: Function[] = []; // Original empty array
