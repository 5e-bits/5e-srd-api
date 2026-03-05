import { Arg, Args, FieldResolver, Query, Resolver, Root } from 'type-graphql'

import { ScorePrerequisiteChoice2024 } from '@/graphql/2024/common/choiceTypes'
import { resolveScorePrerequisiteChoice } from '@/graphql/2024/utils/choiceResolvers'
import { buildSortPipeline } from '@/graphql/common/args'
import FeatModel, { Feat2024 } from '@/models/2024/feat'
import { escapeRegExp } from '@/util'

import { FEAT_SORT_FIELD_MAP, FeatArgs, FeatArgsSchema, FeatIndexArgsSchema, FeatOrderField } from './args'

@Resolver(Feat2024)
export class FeatResolver {
  @Query(() => [Feat2024], {
    description: 'Gets all feats, optionally filtered by name and type.'
  })
  async feats(@Args(() => FeatArgs) args: FeatArgs): Promise<Feat2024[]> {
    const validatedArgs = FeatArgsSchema.parse(args)

    const query = FeatModel.find()
    const filters: any[] = []

    if (validatedArgs.name != null && validatedArgs.name !== '') {
      filters.push({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    if (validatedArgs.type && validatedArgs.type.length > 0) {
      filters.push({ type: { $in: validatedArgs.type } })
    }

    if (filters.length > 0) {
      query.where({ $and: filters })
    }

    const sortQuery = buildSortPipeline<FeatOrderField>({
      order: validatedArgs.order,
      sortFieldMap: FEAT_SORT_FIELD_MAP,
      defaultSortField: FeatOrderField.NAME
    })

    if (Object.keys(sortQuery).length > 0) {
      query.sort(sortQuery)
    }

    if (validatedArgs.skip !== undefined) {
      query.skip(validatedArgs.skip)
    }
    if (validatedArgs.limit !== undefined) {
      query.limit(validatedArgs.limit)
    }

    return query.lean()
  }

  @Query(() => Feat2024, { nullable: true, description: 'Gets a single feat by index.' })
  async feat(@Arg('index', () => String) indexInput: string): Promise<Feat2024 | null> {
    const { index } = FeatIndexArgsSchema.parse({ index: indexInput })
    return FeatModel.findOne({ index }).lean()
  }

  @FieldResolver(() => ScorePrerequisiteChoice2024, { nullable: true })
  async prerequisite_options(@Root() feat: Feat2024): Promise<ScorePrerequisiteChoice2024 | null> {
    return resolveScorePrerequisiteChoice(feat.prerequisite_options)
  }
}
