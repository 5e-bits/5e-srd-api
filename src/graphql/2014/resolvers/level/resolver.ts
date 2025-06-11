import { Arg, Args, FieldResolver, Query, Resolver, Root } from 'type-graphql'

import { buildSortPipeline } from '@/graphql/common/args'
import { buildMongoQueryFromNumberFilter } from '@/graphql/common/inputs'
import { resolveMultipleReferences, resolveSingleReference } from '@/graphql/utils/resolvers'
import ClassModel, { Class } from '@/models/2014/class'
import FeatureModel, { Feature } from '@/models/2014/feature'
import LevelModel, { Level } from '@/models/2014/level'
import SubclassModel, { Subclass } from '@/models/2014/subclass'

import {
  LEVEL_SORT_FIELD_MAP,
  LevelArgs,
  LevelArgsSchema,
  LevelIndexArgsSchema,
  LevelOrderField
} from './args'

@Resolver(Level)
export class LevelResolver {
  @Query(() => Level, {
    nullable: true,
    description:
      'Gets a single level by its combined index (e.g., wizard-3-evocation or fighter-5).'
  })
  async level(@Arg('index', () => String) indexInput: string): Promise<Level | null> {
    const { index } = LevelIndexArgsSchema.parse({ index: indexInput })
    return LevelModel.findOne({ index }).lean()
  }

  @Query(() => [Level], { description: 'Gets all levels, optionally filtered and sorted.' })
  async levels(@Args(() => LevelArgs) args: LevelArgs): Promise<Level[]> {
    const validatedArgs = LevelArgsSchema.parse(args)

    let query = LevelModel.find()
    const filters: any[] = []

    if (validatedArgs.class && validatedArgs.class.length > 0) {
      filters.push({ 'class.index': { $in: validatedArgs.class } })
    }

    if (validatedArgs.subclass && validatedArgs.subclass.length > 0) {
      filters.push({ 'subclass.index': { $in: validatedArgs.subclass } })
    }

    if (validatedArgs.level) {
      const levelQuery = buildMongoQueryFromNumberFilter(validatedArgs.level)
      if (levelQuery) {
        filters.push({ level: levelQuery })
      }
    }

    if (validatedArgs.ability_score_bonuses != null) {
      filters.push({ ability_score_bonuses: validatedArgs.ability_score_bonuses })
    }

    if (validatedArgs.prof_bonus != null) {
      filters.push({ prof_bonus: validatedArgs.prof_bonus })
    }

    if (filters.length > 0) {
      query = query.where({ $and: filters })
    }

    const sortQuery = buildSortPipeline<LevelOrderField>({
      order: validatedArgs.order,
      sortFieldMap: LEVEL_SORT_FIELD_MAP,
      defaultSortField: LevelOrderField.LEVEL
    })

    if (Object.keys(sortQuery).length > 0) {
      query = query.sort(sortQuery)
    }

    if (validatedArgs.skip !== undefined) {
      query = query.skip(validatedArgs.skip)
    }
    if (validatedArgs.limit !== undefined) {
      query = query.limit(validatedArgs.limit)
    }

    return query.lean()
  }

  @FieldResolver(() => Class, { nullable: true })
  async class(@Root() level: Level): Promise<Class | null> {
    return resolveSingleReference(level.class, ClassModel)
  }

  @FieldResolver(() => Subclass, { nullable: true })
  async subclass(@Root() level: Level): Promise<Subclass | null> {
    return resolveSingleReference(level.subclass, SubclassModel)
  }

  @FieldResolver(() => [Feature])
  async features(@Root() level: Level): Promise<Feature[]> {
    return resolveMultipleReferences(level.features, FeatureModel)
  }
}
