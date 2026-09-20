import { FieldResolver, Resolver, Root } from 'type-graphql'

import { createResolver } from '@/graphql/common/createResolver'
import { inFilter, numberFilter } from '@/graphql/common/filters'
import { resolveMultipleReferences, resolveSingleReference } from '@/graphql/utils/resolvers'
import Class2024Model, { Class2024 } from '@/models/2024/class'
import Feature2024Model, { Feature2024 } from '@/models/2024/feature'
import Level2024Model, { Level2024 } from '@/models/2024/level'
import Subclass2024Model, { Subclass2024 } from '@/models/2024/subclass'

import { LevelArgs, LevelArgsSchema } from './args'

@Resolver(Level2024)
export class LevelResolver extends createResolver({
  Type: Level2024,
  Model: Level2024Model,
  typeName: 'Level',
  enumTypeName: 'Level2024',
  singular: 'level',
  plural: 'levels',
  descriptions: {
    fields: 'Fields to sort 2024 Levels by',
    order: 'Specify sorting order for levels. Allows nested sorting. Defaults to LEVEL ascending.',
    list: 'Gets all 2024 levels, optionally filtered and sorted.',
    single: 'Gets a single 2024 level by its combined index (e.g., barbarian-3, berserker-3).'
  },
  orderFields: {
    LEVEL: { value: 'level', path: 'level' },
    CLASS: { value: 'class', path: 'class.name' },
    SUBCLASS: { value: 'subclass', path: 'subclass.name' }
  },
  defaultSort: 'LEVEL',
  Args: LevelArgs,
  argsSchema: LevelArgsSchema,
  filters: (a) => [
    inFilter('class.index', a.class),
    inFilter('subclass.index', a.subclass),
    numberFilter('level', a.level),
    numberFilter('prof_bonus', a.prof_bonus)
  ]
}) {
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
