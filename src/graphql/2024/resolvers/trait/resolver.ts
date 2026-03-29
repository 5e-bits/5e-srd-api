import { Arg, Args, FieldResolver, Query, Resolver, Root } from 'type-graphql'

import { buildSortPipeline } from '@/graphql/common/args'
import { resolveMultipleReferences } from '@/graphql/utils/resolvers'
import Species2024Model, { Species2024 } from '@/models/2024/species'
import Subspecies2024Model, { Subspecies2024 } from '@/models/2024/subspecies'
import Trait2024Model, { Trait2024 } from '@/models/2024/trait'
import { escapeRegExp } from '@/util'

import {
  TRAIT_SORT_FIELD_MAP,
  TraitArgs,
  TraitArgsSchema,
  TraitIndexArgsSchema,
  TraitOrderField
} from './args'

@Resolver(Trait2024)
export class TraitResolver {
  @Query(() => [Trait2024], {
    description: 'Gets all traits, optionally filtered by name and sorted by name.'
  })
  async traits2024(@Args(() => TraitArgs) args: TraitArgs): Promise<Trait2024[]> {
    const validatedArgs = TraitArgsSchema.parse(args)
    const query = Trait2024Model.find()

    if (validatedArgs.name != null && validatedArgs.name !== '') {
      query.where({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    const sortQuery = buildSortPipeline<TraitOrderField>({
      order: validatedArgs.order,
      sortFieldMap: TRAIT_SORT_FIELD_MAP,
      defaultSortField: TraitOrderField.NAME
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

  @Query(() => Trait2024, { nullable: true, description: 'Gets a single trait by index.' })
  async trait2024(@Arg('index', () => String) indexInput: string): Promise<Trait2024 | null> {
    const { index } = TraitIndexArgsSchema.parse({ index: indexInput })
    return Trait2024Model.findOne({ index }).lean()
  }

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
