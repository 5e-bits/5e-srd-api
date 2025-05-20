import {
  Resolver,
  Query,
  Arg,
  Args,
  ArgsType,
  Field,
  FieldResolver,
  Root,
  registerEnumType
} from 'type-graphql'
import { z } from 'zod'
import FeatureModel, {
  Feature,
  FeatureSpecific,
  LevelPrerequisite,
  FeaturePrerequisite,
  SpellPrerequisite
} from '@/models/2014/feature'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import {
  NumberFilterInput,
  buildMongoQueryFromNumberFilter,
  buildMongoSortQuery,
  NumberFilterInputSchema
} from '../common/inputs'
import { escapeRegExp } from '@/util'
import ClassModel, { Class } from '@/models/2014/class'
import SubclassModel, { Subclass } from '@/models/2014/subclass'
import {
  resolveMultipleReferences,
  resolveSingleReference
} from '@/graphql/2014rewrite/utils/resolvers'
import SpellModel from '@/models/2014/spell'
import { FeaturePrerequisiteUnion } from '@/graphql/2014rewrite/common/unions'
import { BasePaginationArgs, BasePaginationArgsSchema } from '../common/args'

export enum FeatureOrderField {
  NAME = 'name',
  LEVEL = 'level',
  CLASS = 'class',
  SUBCLASS = 'subclass'
}

registerEnumType(FeatureOrderField, {
  name: 'FeatureOrderField',
  description: 'Fields to sort Features by'
})

const FEATURE_SORT_FIELD_MAP: Record<FeatureOrderField, string> = {
  [FeatureOrderField.NAME]: 'name',
  [FeatureOrderField.LEVEL]: 'level',
  [FeatureOrderField.CLASS]: 'class.name',
  [FeatureOrderField.SUBCLASS]: 'subclass.name'
}

const FeatureArgsSchema = z
  .object({
    name: z.string().optional(),
    level: NumberFilterInputSchema.optional(),
    class: z.array(z.string()).optional(),
    subclass: z.array(z.string()).optional(),
    order_by: z.nativeEnum(FeatureOrderField).optional(),
    order_direction: z.nativeEnum(OrderByDirection).optional().default(OrderByDirection.ASC)
  })
  .merge(BasePaginationArgsSchema)

const FeatureIndexArgsSchema = z.object({
  index: z.string().min(1, { message: 'Index must be a non-empty string' })
})

@ArgsType()
class FeatureArgs extends BasePaginationArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by feature name (case-insensitive, partial match)'
  })
  name?: string

  @Field(() => NumberFilterInput, {
    nullable: true,
    description: 'Filter by level. Allows exact match, list, or range.'
  })
  level?: NumberFilterInput

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by one or more associated class indices'
  })
  class?: string[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by one or more associated subclass indices'
  })
  subclass?: string[]

  @Field(() => FeatureOrderField, {
    nullable: true,
    description: 'Field to sort features by (e.g., NAME, LEVEL, CLASS, SUBCLASS).'
  })
  order_by?: FeatureOrderField

  @Field(() => OrderByDirection, {
    nullable: true,
    description: 'Sort direction for the chosen field (default: ASC)'
  })
  order_direction?: OrderByDirection
}

@Resolver(Feature)
export class FeatureResolver {
  @Query(() => [Feature], {
    description: 'Gets all features, optionally filtered and sorted.'
  })
  async features(@Args() args: FeatureArgs): Promise<Feature[]> {
    const validatedArgs = FeatureArgsSchema.parse(args)

    const query = FeatureModel.find()
    const filters: any[] = []

    if (validatedArgs.name) {
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

    const sortQuery = buildMongoSortQuery<FeatureOrderField>({
      orderBy: validatedArgs.order_by,
      orderDirection: validatedArgs.order_direction,
      sortFieldMap: FEATURE_SORT_FIELD_MAP,
      defaultSortField: FeatureOrderField.NAME
    })
    if (sortQuery) {
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
