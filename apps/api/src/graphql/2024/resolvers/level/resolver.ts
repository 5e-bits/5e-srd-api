import { Args, FieldResolver, Query, Resolver, Root } from 'type-graphql'

import { buildSortPipeline } from '@/graphql/common/args'
import { buildMongoQueryFromNumberFilter } from '@/graphql/common/inputs'
import { resolveMultipleReferences, resolveSingleReference } from '@/graphql/utils/resolvers'
import Class2024Model, { Class2024 } from '@/models/2024/class'
import Feature2024Model, { Feature2024 } from '@/models/2024/feature'
import Level2024Model, { Level2024 } from '@/models/2024/level'
import Subclass2024Model, { Subclass2024 } from '@/models/2024/subclass'

import {
  LEVEL_SORT_FIELD_MAP,
  LevelArgs,
  LevelArgsSchema,
  LevelIndexArgs,
  LevelIndexArgsSchema,
  LevelOrderField
} from './args'

@Resolver(Level2024)
export class LevelResolver {
  @Query(() => Level2024, {
    nullable: true,
    description: 'Gets a single 2024 level by its combined index (e.g., barbarian-3, berserker-3).'
  })
  async level(@Args(() => LevelIndexArgs) args: LevelIndexArgs): Promise<Level2024 | null> {
    const { index } = LevelIndexArgsSchema.parse(args)
    return Level2024Model.findOne({ index }).lean()
  }

  @Query(() => [Level2024], {
    description: 'Gets all 2024 levels, optionally filtered and sorted.'
  })
  async levels(@Args(() => LevelArgs) args: LevelArgs): Promise<Level2024[]> {
    const validatedArgs = LevelArgsSchema.parse(args)

    let query = Level2024Model.find()
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

    if (validatedArgs.prof_bonus) {
      const profBonusQuery = buildMongoQueryFromNumberFilter(validatedArgs.prof_bonus)
      if (profBonusQuery) {
        filters.push({ prof_bonus: profBonusQuery })
      }
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

  @FieldResolver(() => Class2024, { nullable: true })
  async class(@Root() level: Level2024): Promise<Class2024 | null> {
    return resolveSingleReference(level.class, Class2024Model)
  }

  @FieldResolver(() => Subclass2024, { nullable: true })
  async subclass(@Root() level: Level2024): Promise<Subclass2024 | null> {
    return resolveSingleReference(level.subclass, Subclass2024Model)
  }

  @FieldResolver(() => [Feature2024])
  async features(@Root() level: Level2024): Promise<Feature2024[]> {
    return resolveMultipleReferences(level.features, Feature2024Model)
  }
}
