import { buildSchemaSync, NonEmptyArray } from 'type-graphql'
import { AlignmentResolver } from './resolvers/AlignmentResolver'

// Add newly migrated resolvers to this array
const resolvers_2014: NonEmptyArray<any> = [
  AlignmentResolver
  // ... other migrated resolvers will go here
]

// Build the schema synchronously
// Use buildSchema (async) if top-level await is supported or needed
const schema = buildSchemaSync({
  resolvers: resolvers_2014,
  // Add other options like authChecker, pubSub, etc. if needed later
  validate: false // Disable validation initially
})

export default schema
