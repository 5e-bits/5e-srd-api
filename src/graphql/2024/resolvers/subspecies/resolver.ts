import { Arg, Args, FieldResolver, Query, Resolver, Root } from 'type-graphql'

import { buildSortPipeline } from '@/graphql/common/args'
import { resolveMultipleReferences, resolveSingleReference } from '@/graphql/utils/resolvers'
import DamageType2024Model, { DamageType2024 } from '@/models/2024/damageType'
import Species2024Model, { Species2024 } from '@/models/2024/species'
import Subspecies2024Model, { Subspecies2024 } from '@/models/2024/subspecies'
import Trait2024Model, { Trait2024 } from '@/models/2024/trait'
import { escapeRegExp } from '@/util'

import {
  SUBSPECIES_SORT_FIELD_MAP,
  SubspeciesArgs,
  SubspeciesArgsSchema,
  SubspeciesIndexArgsSchema,
  SubspeciesOrderField
} from './args'

@Resolver(Subspecies2024)
export class SubspeciesResolver {
  @Query(() => [Subspecies2024], {
    description: 'Gets all subspecies, optionally filtered by name and sorted by name.'
  })
  async subspecies2024(
    @Args(() => SubspeciesArgs) args: SubspeciesArgs
  ): Promise<Subspecies2024[]> {
    const validatedArgs = SubspeciesArgsSchema.parse(args)
    const query = Subspecies2024Model.find()

    if (validatedArgs.name != null && validatedArgs.name !== '') {
      query.where({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    const sortQuery = buildSortPipeline<SubspeciesOrderField>({
      order: validatedArgs.order,
      sortFieldMap: SUBSPECIES_SORT_FIELD_MAP,
      defaultSortField: SubspeciesOrderField.NAME
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

  @Query(() => Subspecies2024, {
    nullable: true,
    description: 'Gets a single subspecies by index.'
  })
  async subspecies2024ByIndex(
    @Arg('index', () => String) indexInput: string
  ): Promise<Subspecies2024 | null> {
    const { index } = SubspeciesIndexArgsSchema.parse({ index: indexInput })
    return Subspecies2024Model.findOne({ index }).lean()
  }

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
