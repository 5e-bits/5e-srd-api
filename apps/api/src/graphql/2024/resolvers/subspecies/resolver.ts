import { FieldResolver, Resolver, Root } from 'type-graphql'

import { createResolver } from '@/graphql/common/createResolver'
import { resolveMultipleReferences, resolveSingleReference } from '@/graphql/utils/resolvers'
import DamageType2024Model, { DamageType2024 } from '@/models/2024/damageType'
import Species2024Model, { Species2024 } from '@/models/2024/species'
import Subspecies2024Model, { Subspecies2024 } from '@/models/2024/subspecies'
import Trait2024Model, { Trait2024 } from '@/models/2024/trait'

@Resolver(Subspecies2024)
export class SubspeciesResolver extends createResolver({
  Type: Subspecies2024,
  Model: Subspecies2024Model,
  typeName: 'Subspecies',
  enumTypeName: 'Subspecies2024',
  singular: 'subspecies2024ByIndex',
  plural: 'subspecies2024',
  descriptions: {
    fields: 'Fields to sort Subspecies by',
    order: 'Specify sorting order for subspecies.',
    list: 'Gets all subspecies, optionally filtered by name and sorted by name.',
    single: 'Gets a single subspecies by index.'
  }
}) {
  @FieldResolver(() => Species2024, {
    description: 'The parent species of this subspecies.'
  })
  async species(@Root() subspecies: Subspecies2024): Promise<Species2024 | null> {
    return resolveSingleReference(subspecies.species, Species2024Model)
  }

  @FieldResolver(() => [Trait2024], {
    description: 'The traits associated with this subspecies.'
  })
  async traits(@Root() subspecies: Subspecies2024): Promise<Trait2024[]> {
    return resolveMultipleReferences(subspecies.traits, Trait2024Model)
  }

  @FieldResolver(() => DamageType2024, {
    nullable: true,
    description: 'The damage type associated with this subspecies (Dragonborn only).'
  })
  async damage_type(@Root() subspecies: Subspecies2024): Promise<DamageType2024 | null> {
    return resolveSingleReference(subspecies.damage_type, DamageType2024Model)
  }
}
