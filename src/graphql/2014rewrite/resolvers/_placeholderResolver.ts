import { Query, Resolver } from 'type-graphql'

@Resolver()
export class PlaceholderResolver {
  @Query(() => String) // Define a simple query returning String
  hello(): string {
    return 'World' // Simple implementation
  }
}
