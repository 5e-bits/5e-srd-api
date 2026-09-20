import { FieldResolver, Resolver, Root } from 'type-graphql'

import { FeaturePrerequisiteUnion } from '@/graphql/2014/types/featureTypes'
import { createResolver } from '@/graphql/common/createResolver'
import { inFilter, numberFilter, regexFilter } from '@/graphql/common/filters'
import { resolveMultipleReferences, resolveSingleReference } from '@/graphql/utils/resolvers'
import ClassModel, { Class } from '@/models/2014/class'
import FeatureModel, {
  Feature,
  FeaturePrerequisite,
  FeatureSpecific,
  LevelPrerequisite,
  SpellPrerequisite
} from '@/models/2014/feature'
import SpellModel from '@/models/2014/spell'
import SubclassModel, { Subclass } from '@/models/2014/subclass'

import { FeatureArgs, FeatureArgsSchema } from './args'

@Resolver(Feature)
export class FeatureResolver extends createResolver({
  Type: Feature,
  Model: FeatureModel,
  typeName: 'Feature',
  singular: 'feature',
  plural: 'features',
  descriptions: {
    fields: 'Fields to sort Features by',
    order: 'Specify sorting order for features.',
    list: 'Gets all features, optionally filtered and sorted.',
    single: 'Gets a single feature by its index.'
  },
  orderFields: {
    NAME: { value: 'name', path: 'name' },
    LEVEL: { value: 'level', path: 'level' },
    CLASS: { value: 'class', path: 'class.name' },
    SUBCLASS: { value: 'subclass', path: 'subclass.name' }
  },
  defaultSort: 'NAME',
  Args: FeatureArgs,
  argsSchema: FeatureArgsSchema,
  filters: (a) => [
    regexFilter('name', a.name),
    numberFilter('level', a.level),
    inFilter('class.index', a.class),
    inFilter('subclass.index', a.subclass)
  ]
}) {
  @FieldResolver(() => Class, { nullable: true })
  async class(@Root() feature: Feature): Promise<Class | null> {
    return resolveSingleReference(feature.class, ClassModel)
  }

  @FieldResolver(() => Feature, { nullable: true })
  async parent(@Root() feature: Feature): Promise<Feature | null> {
    return resolveSingleReference(feature.parent, FeatureModel)
  }

  @FieldResolver(() => Subclass, { nullable: true })
  async subclass(@Root() feature: Feature): Promise<Subclass | null> {
    return resolveSingleReference(feature.subclass, SubclassModel)
  }

  @FieldResolver(() => [FeaturePrerequisiteUnion], {
    nullable: true,
    description: 'Resolves the prerequisites array, fetching referenced Features or Spells.'
  })
  async prerequisites(
    @Root() feature: Feature
  ): Promise<Array<LevelPrerequisite | FeaturePrerequisite | SpellPrerequisite> | null> {
    const prereqsData = feature.prerequisites

    if (!prereqsData || prereqsData.length === 0) {
      return null
    }

    const resolvedPrereqsPromises = prereqsData.map(
      async (
        prereq
      ): Promise<LevelPrerequisite | FeaturePrerequisite | SpellPrerequisite | null> => {
        switch (prereq.type) {
          case 'level': {
            return prereq as LevelPrerequisite
          }
          case 'feature': {
            const featureUrl = (prereq as FeaturePrerequisite).feature
            const referencedFeature = await FeatureModel.findOne({ url: featureUrl }).lean()
            if (referencedFeature) {
              return {
                type: 'feature',
                feature: referencedFeature
              } as unknown as FeaturePrerequisite
            } else {
              console.warn(`Could not find prerequisite feature with url: ${featureUrl}`)
              return null
            }
          }
          case 'spell': {
            const spellUrl = (prereq as SpellPrerequisite).spell
            const referencedSpell = await SpellModel.findOne({ url: spellUrl }).lean()
            if (referencedSpell) {
              return {
                type: 'spell',
                spell: referencedSpell
              } as unknown as SpellPrerequisite
            } else {
              console.warn(`Could not find prerequisite spell with index: ${spellUrl}`)
              return null
            }
          }
          default: {
            console.warn(`Unknown prerequisite type found: ${prereq.type}`)
            return null
          }
        }
      }
    )

    const resolvedPrereqs = (await Promise.all(resolvedPrereqsPromises)).filter(
      (p) => p !== null
    ) as Array<LevelPrerequisite | FeaturePrerequisite | SpellPrerequisite>

    return resolvedPrereqs.length > 0 ? resolvedPrereqs : null
  }
}

@Resolver(FeatureSpecific)
export class FeatureSpecificResolver {
  @FieldResolver(() => [Feature], { nullable: true })
  async invocations(@Root() featureSpecific: FeatureSpecific): Promise<Feature[]> {
    return resolveMultipleReferences(featureSpecific.invocations, FeatureModel)
  }
}
