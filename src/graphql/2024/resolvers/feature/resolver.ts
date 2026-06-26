import { Args, FieldResolver, Query, Resolver, Root } from 'type-graphql'

import { buildSortPipeline } from '@/graphql/common/args'
import { resolveSingleReference } from '@/graphql/utils/resolvers'
import Class2024Model, { Class2024 } from '@/models/2024/class'
import Feature2024Model, { Feature2024 } from '@/models/2024/feature'
import Subclass2024Model, { Subclass2024 } from '@/models/2024/subclass'
import { escapeRegExp } from '@/util'

import {
  FEATURE_SORT_FIELD_MAP,
  FeatureArgs,
  FeatureArgsSchema,
  FeatureIndexArgs,
  FeatureIndexArgsSchema,
  FeatureOrderField
} from './args'

@Resolver(Feature2024)
export class FeatureResolver {
  @Query(() => [Feature2024], {
    description: 'Gets all 2024 features, optionally filtered and sorted.'
  })
  async features(@Args(() => FeatureArgs) args: FeatureArgs): Promise<Feature2024[]> {
    const validatedArgs = FeatureArgsSchema.parse(args)

    const query = Feature2024Model.find()
    const filters: any[] = []

    if (validatedArgs.name != null && validatedArgs.name !== '') {
      filters.push({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }
    if (validatedArgs.level && validatedArgs.level.length > 0) {
      filters.push({ 'level.index': { $in: validatedArgs.level } })
    }
    if (validatedArgs.class && validatedArgs.class.length > 0) {
      filters.push({ 'class.index': { $in: validatedArgs.class } })
    }
    if (validatedArgs.subclass && validatedArgs.subclass.length > 0) {
      filters.push({ 'subclass.index': { $in: validatedArgs.subclass } })
    }

    if (filters.length > 0) {
      query.where({ $and: filters })
    }

    const sortQuery = buildSortPipeline<FeatureOrderField>({
      order: validatedArgs.order,
      sortFieldMap: FEATURE_SORT_FIELD_MAP,
      defaultSortField: FeatureOrderField.NAME
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

  @Query(() => Feature2024, {
    nullable: true,
    description: 'Gets a single 2024 feature by index.'
  })
  async feature(@Args(() => FeatureIndexArgs) args: FeatureIndexArgs): Promise<Feature2024 | null> {
    const { index } = FeatureIndexArgsSchema.parse(args)
    return Feature2024Model.findOne({ index }).lean()
  }

  @FieldResolver(() => Class2024, { nullable: true })
  async class(@Root() feature: Feature2024): Promise<Class2024 | null> {
    return resolveSingleReference(feature.class, Class2024Model)
  }

  @FieldResolver(() => Subclass2024, { nullable: true })
  async subclass(@Root() feature: Feature2024): Promise<Subclass2024 | null> {
    return resolveSingleReference(feature.subclass, Subclass2024Model)
  }
}
