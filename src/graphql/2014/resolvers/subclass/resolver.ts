import { Arg, Args, FieldResolver, Query, Resolver, Root } from 'type-graphql'

import { SubclassSpellPrerequisiteUnion } from '@/graphql/2014/types/subclassTypes'
import { buildSortPipeline } from '@/graphql/common/args'
import { resolveSingleReference } from '@/graphql/utils/resolvers'
import ClassModel, { Class } from '@/models/2014/class'
import FeatureModel, { Feature } from '@/models/2014/feature'
import LevelModel, { Level } from '@/models/2014/level'
import SpellModel, { Spell } from '@/models/2014/spell'
import SubclassModel, { Subclass, SubclassSpell } from '@/models/2014/subclass'
import { escapeRegExp } from '@/util'

import {
  SUBCLASS_SORT_FIELD_MAP,
  SubclassArgs,
  SubclassArgsSchema,
  SubclassIndexArgsSchema,
  SubclassOrderField
} from './args'

@Resolver(Subclass)
export class SubclassResolver {
  @Query(() => [Subclass], {
    description: 'Gets all subclasses, optionally filtered by name and sorted.'
  })
  async subclasses(@Args(() => SubclassArgs) args: SubclassArgs): Promise<Subclass[]> {
    const validatedArgs = SubclassArgsSchema.parse(args)

    const query = SubclassModel.find()

    if (validatedArgs.name != null && validatedArgs.name !== '') {
      query.where({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    const sortQuery = buildSortPipeline<SubclassOrderField>({
      order: validatedArgs.order,
      sortFieldMap: SUBCLASS_SORT_FIELD_MAP,
      defaultSortField: SubclassOrderField.NAME
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

  @Query(() => Subclass, { nullable: true, description: 'Gets a single subclass by its index.' })
  async subclass(@Arg('index', () => String) indexInput: string): Promise<Subclass | null> {
    const { index } = SubclassIndexArgsSchema.parse({ index: indexInput })
    return SubclassModel.findOne({ index }).lean()
  }

  @FieldResolver(() => Class, { nullable: true })
  async class(@Root() subclass: Subclass): Promise<Class | null> {
    return resolveSingleReference(subclass.class, ClassModel)
  }

  @FieldResolver(() => [Level], { nullable: true })
  async subclass_levels(@Root() subclass: Subclass): Promise<Level[]> {
    if (!subclass.index) return []

    return LevelModel.find({ 'subclass.index': subclass.index }).sort({ level: 1 }).lean()
  }
}

@Resolver(SubclassSpell)
export class SubclassSpellResolver {
  @FieldResolver(() => [SubclassSpellPrerequisiteUnion], {
    description: 'Resolves the prerequisites to actual Level or Feature objects.',
    nullable: true
  })
  async prerequisites(
    @Root() subclassSpell: SubclassSpell
  ): Promise<Array<Level | Feature> | null> {
    const prereqsData = subclassSpell.prerequisites

    if (prereqsData.length === 0) {
      return null
    }

    const resolvedPrereqs: Array<Level | Feature> = []

    for (const prereq of prereqsData) {
      if (prereq.type === 'level') {
        const level = await LevelModel.findOne({ index: prereq.index }).lean()
        if (level !== null) {
          resolvedPrereqs.push(level)
        }
      } else if (prereq.type === 'feature') {
        const feature = await FeatureModel.findOne({ index: prereq.index }).lean()
        if (feature !== null) {
          resolvedPrereqs.push(feature)
        }
      }
    }

    return resolvedPrereqs.length > 0 ? resolvedPrereqs : null
  }

  @FieldResolver(() => Spell, {
    description: 'The spell gained.',
    nullable: false
  })
  async spell(
    @Root() subclassSpell: SubclassSpell
  ): Promise<Spell | null> {
    return SpellModel.findOne({ 'index': subclassSpell.spell.index }).lean()
  }
}
