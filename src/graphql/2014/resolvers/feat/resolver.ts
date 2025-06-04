import { Arg, Args, FieldResolver, Query, Resolver, Root } from 'type-graphql'

import { buildSortPipeline } from '@/graphql/common/args'
import { resolveSingleReference } from '@/graphql/utils/resolvers'
import AbilityScoreModel, { AbilityScore } from '@/models/2014/abilityScore'
import FeatModel, { Feat, Prerequisite } from '@/models/2014/feat'
import { escapeRegExp } from '@/util'

import {
  FEAT_SORT_FIELD_MAP,
  FeatArgs,
  FeatArgsSchema,
  FeatIndexArgsSchema,
  FeatOrderField
} from './args'

@Resolver(Feat)
export class FeatResolver {
  @Query(() => [Feat], {
    description: 'Gets all feats, optionally filtered by name and sorted by name.'
  })
  async feats(@Args(() => FeatArgs) args: FeatArgs): Promise<Feat[]> {
    const validatedArgs = FeatArgsSchema.parse(args)
    const query = FeatModel.find()

    if (validatedArgs.name != null && validatedArgs.name !== '') {
      query.where({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    const sortQuery = buildSortPipeline<FeatOrderField>({
      order: validatedArgs.order,
      sortFieldMap: FEAT_SORT_FIELD_MAP,
      defaultSortField: FeatOrderField.NAME
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

  @Query(() => Feat, { nullable: true, description: 'Gets a single feat by index.' })
  async feat(@Arg('index', () => String) indexInput: string): Promise<Feat | null> {
    const { index } = FeatIndexArgsSchema.parse({ index: indexInput })
    return FeatModel.findOne({ index }).lean()
  }
}

@Resolver(Prerequisite)
export class PrerequisiteResolver {
  @FieldResolver(() => AbilityScore, { nullable: true })
  async ability_score(@Root() prerequisite: Prerequisite): Promise<AbilityScore | null> {
    return resolveSingleReference(prerequisite.ability_score, AbilityScoreModel)
  }
}
