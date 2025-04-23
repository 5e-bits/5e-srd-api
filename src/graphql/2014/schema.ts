import { buildSchemaSync, NonEmptyArray, ClassType } from 'type-graphql'
import { AlignmentResolver } from './resolvers/AlignmentResolver'
import { ConditionResolver } from './resolvers/ConditionResolver'
import { DamageTypeResolver } from './resolvers/DamageTypeResolver'

// Add newly migrated resolvers to this array
const resolvers = [
  AlignmentResolver,
  ConditionResolver,
  DamageTypeResolver
  // ... other migrated resolvers will go here
] as const satisfies NonEmptyArray<ClassType>

// Build the schema synchronously
// Use buildSchema (async) if top-level await is supported or needed
export const schema2014 = buildSchemaSync({
  resolvers: resolvers,
  // Add other options like authChecker, pubSub, etc. if needed later
  validate: false // Disable validation initially
})
