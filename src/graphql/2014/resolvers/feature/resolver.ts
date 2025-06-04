import { Arg, Args, FieldResolver, Query, Resolver, Root } from 'type-graphql'

import { FeaturePrerequisiteUnion } from '@/graphql/2014/types/featureTypes'
import { buildSortPipeline } from '@/graphql/common/args'
import { buildMongoQueryFromNumberFilter } from '@/graphql/common/inputs'
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
import { escapeRegExp } from '@/util'

import {
  FEATURE_SORT_FIELD_MAP,
  FeatureArgs,
  FeatureArgsSchema,
  FeatureIndexArgsSchema,
  FeatureOrderField
} from './args'

@Resolver(Feature)
export class FeatureResolver {
  @Query(() => [Feature], {
    description: 'Gets all features, optionally filtered and sorted.'
  })
  async features(@Args(() => FeatureArgs) args: FeatureArgs): Promise<Feature[]> {
    const validatedArgs = FeatureArgsSchema.parse(args)

    const query = FeatureModel.find()
    const filters: any[] = []

    if (validatedArgs.name != null && validatedArgs.name !== '') {
      filters.push({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }
    if (validatedArgs.level) {
      const levelQuery = buildMongoQueryFromNumberFilter(validatedArgs.level)
      if (levelQuery) {
        filters.push({ level: levelQuery })
      }
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

    if (validatedArgs.skip) {
      query.skip(validatedArgs.skip)
    }
    if (validatedArgs.limit) {
      query.limit(validatedArgs.limit)
    }

    return query.lean()
  }

  @Query(() => Feature, { nullable: true, description: 'Gets a single feature by its index.' })
  async feature(@Arg('index', () => String) indexInput: string): Promise<Feature | null> {
    const { index } = FeatureIndexArgsSchema.parse({ index: indexInput })
    return FeatureModel.findOne({ index }).lean()
  }

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
