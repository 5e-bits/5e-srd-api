import { FieldResolver, Resolver, Root } from 'type-graphql'

import { createResolver } from '@/graphql/common/createResolver'
import { eqFilter, inFilter, numberFilter } from '@/graphql/common/filters'
import { resolveMultipleReferences, resolveSingleReference } from '@/graphql/utils/resolvers'
import ClassModel, { Class } from '@/models/2014/class'
import FeatureModel, { Feature } from '@/models/2014/feature'
import LevelModel, { Level } from '@/models/2014/level'
import SubclassModel, { Subclass } from '@/models/2014/subclass'

import { LevelArgs, LevelArgsSchema } from './args'

@Resolver(Level)
export class LevelResolver extends createResolver({
  Type: Level,
  Model: LevelModel,
  typeName: 'Level',
  singular: 'level',
  plural: 'levels',
  descriptions: {
    fields: 'Fields to sort Levels by',
    order: 'Specify sorting order for levels. Allows nested sorting. Defaults to LEVEL ascending.',
    list: 'Gets all levels, optionally filtered and sorted.',
    single: 'Gets a single level by its combined index (e.g., wizard-3-evocation or fighter-5).'
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
    eqFilter('ability_score_bonuses', a.ability_score_bonuses),
    eqFilter('prof_bonus', a.prof_bonus)
  ]
}) {
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
