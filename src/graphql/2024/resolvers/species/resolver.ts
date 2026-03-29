import { Arg, Args, FieldResolver, Query, Resolver, Root } from 'type-graphql'

import { buildSortPipeline } from '@/graphql/common/args'
import { resolveMultipleReferences } from '@/graphql/utils/resolvers'
import Species2024Model, { Species2024 } from '@/models/2024/species'
import Subspecies2024Model, { Subspecies2024 } from '@/models/2024/subspecies'
import Trait2024Model, { Trait2024 } from '@/models/2024/trait'
import { escapeRegExp } from '@/util'

import {
  SPECIES_SORT_FIELD_MAP,
  SpeciesArgs,
  SpeciesArgsSchema,
  SpeciesIndexArgsSchema,
  SpeciesOrderField
} from './args'

@Resolver(Species2024)
export class SpeciesResolver {
  @Query(() => [Species2024], {
    description: 'Gets all species, optionally filtered by name and sorted by name.'
  })
  async species2024(@Args(() => SpeciesArgs) args: SpeciesArgs): Promise<Species2024[]> {
    const validatedArgs = SpeciesArgsSchema.parse(args)
    const query = Species2024Model.find()

    if (validatedArgs.name != null && validatedArgs.name !== '') {
      query.where({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    const sortQuery = buildSortPipeline<SpeciesOrderField>({
      order: validatedArgs.order,
      sortFieldMap: SPECIES_SORT_FIELD_MAP,
      defaultSortField: SpeciesOrderField.NAME
    })

    if (Object.keys(sortQuery).length > 0) {
      query.sort(sortQuery)
    }

    if (validatedArgs.skip) {
      query.skip(validatedArgs.skip)
    }
    if (validatedArgs.limit) {
      query.limit(validatedArgs.limit)
    }

    return query.lean()
  }

  @Query(() => Species2024, { nullable: true, description: 'Gets a single species by index.' })
  async species2024ByIndex(
    @Arg('index', () => String) indexInput: string
  ): Promise<Species2024 | null> {
    const { index } = SpeciesIndexArgsSchema.parse({ index: indexInput })
    return Species2024Model.findOne({ index }).lean()
  }

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
