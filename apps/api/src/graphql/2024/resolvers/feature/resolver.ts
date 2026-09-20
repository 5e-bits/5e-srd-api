import { FieldResolver, Resolver, Root } from 'type-graphql'

import { createResolver } from '@/graphql/common/createResolver'
import { inFilter, regexFilter } from '@/graphql/common/filters'
import { resolveSingleReference } from '@/graphql/utils/resolvers'
import Class2024Model, { Class2024 } from '@/models/2024/class'
import Feature2024Model, { Feature2024 } from '@/models/2024/feature'
import Level2024Model, { Level2024 } from '@/models/2024/level'
import Subclass2024Model, { Subclass2024 } from '@/models/2024/subclass'

import { FeatureArgs, FeatureArgsSchema } from './args'

@Resolver(Feature2024)
export class FeatureResolver extends createResolver({
  Type: Feature2024,
  Model: Feature2024Model,
  typeName: 'Feature',
  enumTypeName: 'Feature2024',
  singular: 'feature',
  plural: 'features',
  descriptions: {
    fields: 'Fields to sort 2024 Features by',
    order: 'Specify sorting order for 2024 features.',
    list: 'Gets all 2024 features, optionally filtered and sorted.',
    single: 'Gets a single 2024 feature by index.'
  },
  orderFields: {
    NAME: { value: 'name', path: 'name' },
    LEVEL: { value: 'level', path: 'level.index' },
    CLASS: { value: 'class', path: 'class.name' },
    SUBCLASS: { value: 'subclass', path: 'subclass.name' }
  },
  defaultSort: 'NAME',
  Args: FeatureArgs,
  argsSchema: FeatureArgsSchema,
  filters: (a) => [
    regexFilter('name', a.name),
    inFilter('level.index', a.level),
    inFilter('class.index', a.class),
    inFilter('subclass.index', a.subclass)
  ]
}) {
  @FieldResolver(() => Level2024, { nullable: true })
  async level(@Root() feature: Feature2024): Promise<Level2024 | null> {
    return resolveSingleReference(feature.level, Level2024Model)
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
