import { FieldResolver, Resolver, Root } from 'type-graphql'

import { SubclassSpellPrerequisiteUnion } from '@/graphql/2014/types/subclassTypes'
import { createResolver } from '@/graphql/common/createResolver'
import { resolveSingleReference } from '@/graphql/utils/resolvers'
import ClassModel, { Class } from '@/models/2014/class'
import FeatureModel, { Feature } from '@/models/2014/feature'
import LevelModel, { Level } from '@/models/2014/level'
import SpellModel, { Spell } from '@/models/2014/spell'
import SubclassModel, { Subclass, SubclassSpell } from '@/models/2014/subclass'

@Resolver(Subclass)
export class SubclassResolver extends createResolver({
  Type: Subclass,
  Model: SubclassModel,
  typeName: 'Subclass',
  singular: 'subclass',
  plural: 'subclasses',
  descriptions: {
    fields: 'Fields to sort Subclasses by',
    order: 'Specify sorting order for subclasses.',
    list: 'Gets all subclasses, optionally filtered by name and sorted.',
    single: 'Gets a single subclass by its index.'
  }
}) {
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
  async spell(@Root() subclassSpell: SubclassSpell): Promise<Spell | null> {
    return SpellModel.findOne({ index: subclassSpell.spell.index }).lean()
  }
}
