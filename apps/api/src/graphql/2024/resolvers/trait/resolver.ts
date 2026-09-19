import { FieldResolver, Resolver, Root } from 'type-graphql'

import { createResolver } from '@/graphql/common/createResolver'
import { resolveMultipleReferences } from '@/graphql/utils/resolvers'
import Species2024Model, { Species2024 } from '@/models/2024/species'
import Subspecies2024Model, { Subspecies2024 } from '@/models/2024/subspecies'
import Trait2024Model, { Trait2024 } from '@/models/2024/trait'

@Resolver(Trait2024)
export class TraitResolver extends createResolver({
  Type: Trait2024,
  Model: Trait2024Model,
  typeName: 'Trait',
  enumTypeName: 'Trait2024',
  singular: 'trait2024',
  plural: 'traits2024',
  descriptions: {
    fields: 'Fields to sort Traits by',
    order: 'Specify sorting order for traits.',
    list: 'Gets all traits, optionally filtered by name and sorted by name.',
    single: 'Gets a single trait by index.'
  }
}) {
  @FieldResolver(() => [Species2024], {
    description: 'The species that grant this trait.'
  })
  async species(@Root() trait: Trait2024): Promise<Species2024[]> {
    return resolveMultipleReferences(trait.species, Species2024Model)
  }

  @FieldResolver(() => [Subspecies2024], {
    description: 'The subspecies that grant this trait.'
  })
  async subspecies(@Root() trait: Trait2024): Promise<Subspecies2024[]> {
    return resolveMultipleReferences(trait.subspecies, Subspecies2024Model)
  }
}
