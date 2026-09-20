import { FieldResolver, Resolver, Root } from 'type-graphql'

import { createResolver } from '@/graphql/common/createResolver'
import { resolveMultipleReferences } from '@/graphql/utils/resolvers'
import Species2024Model, { Species2024 } from '@/models/2024/species'
import Subspecies2024Model, { Subspecies2024 } from '@/models/2024/subspecies'
import Trait2024Model, { Trait2024 } from '@/models/2024/trait'

@Resolver(Species2024)
export class SpeciesResolver extends createResolver({
  Type: Species2024,
  Model: Species2024Model,
  typeName: 'Species',
  enumTypeName: 'Species2024',
  singular: 'species2024ByIndex',
  plural: 'species2024',
  descriptions: {
    fields: 'Fields to sort Species by',
    order: 'Specify sorting order for species.',
    list: 'Gets all species, optionally filtered by name and sorted by name.',
    single: 'Gets a single species by index.'
  }
}) {
  @FieldResolver(() => [Subspecies2024], {
    description: 'The subspecies available for this species.'
  })
  async subspecies(@Root() species: Species2024): Promise<Subspecies2024[]> {
    return resolveMultipleReferences(species.subspecies, Subspecies2024Model)
  }

  @FieldResolver(() => [Trait2024], {
    description: 'The traits granted by this species.'
  })
  async traits(@Root() species: Species2024): Promise<Trait2024[]> {
    return resolveMultipleReferences(species.traits, Trait2024Model)
  }
}
