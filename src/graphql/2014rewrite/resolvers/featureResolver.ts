import {
  Resolver,
  Query,
  Arg,
  Args,
  ArgsType,
  Field,
  Int,
  FieldResolver,
  Root,
  registerEnumType
} from 'type-graphql'
import { IsOptional, IsString, IsEnum, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import FeatureModel, {
  Feature,
  FeatureSpecific,
  LevelPrerequisite,
  FeaturePrerequisite,
  SpellPrerequisite
} from '@/models/2014/feature'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { NumberFilterInput, buildMongoQueryFromNumberFilter } from '../common/inputs'
import { escapeRegExp } from '@/util'
import ClassModel, { Class } from '@/models/2014/class'
import SubclassModel, { Subclass } from '@/models/2014/subclass'
import {
  resolveMultipleReferences,
  resolveSingleReference
} from '@/graphql/2014rewrite/utils/resolvers'
import SpellModel from '@/models/2014/spell'
import { FeaturePrerequisiteUnion } from '@/graphql/2014rewrite/common/unions'

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

@ArgsType()
class FeatureArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by feature name (case-insensitive, partial match)'
  })
  @IsOptional()
  @IsString()
  name?: string

  @Field(() => NumberFilterInput, {
    nullable: true,
    description: 'Filter by level. Allows exact match, list, or range.'
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => NumberFilterInput)
  level?: NumberFilterInput

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by one or more associated class indices'
  })
  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  class?: string[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by one or more associated subclass indices'
  })
  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  subclass?: string[]

  @Field(() => FeatureOrderField, {
    nullable: true,
    description: 'Field to sort features by (e.g., NAME, LEVEL, CLASS, SUBCLASS).'
  })
  @IsOptional()
  @IsEnum(FeatureOrderField)
  order_by?: FeatureOrderField

  @Field(() => OrderByDirection, {
    nullable: true,
    defaultValue: OrderByDirection.ASC,
    description: 'Sort direction for the chosen field (default: ASC)'
  })
  @IsOptional()
  @IsEnum(OrderByDirection)
  order_direction?: OrderByDirection

  // TODO: Pass 5 - Implement and refactor to BasePaginationArgs
  @Field(() => Int, { nullable: true, description: 'Number of results to skip for pagination' })
  @IsOptional()
  // @Min(0)
  skip?: number

  // TODO: Pass 5 - Implement and refactor to BasePaginationArgs
  @Field(() => Int, { nullable: true, description: 'Maximum number of results to return' })
  @IsOptional()
  // @Min(1)
  // @Max(100) // Example max limit
  limit?: number
}

@Resolver(Feature)
export class FeatureResolver {
  @Query(() => [Feature], {
    description: 'Gets all features, optionally filtered and sorted.'
  })
  async features(
    @Args()
    {
      name,
      level,
      class: classIndices,
      subclass: subclassIndices,
      order_by,
      order_direction,
      skip,
      limit
    }: FeatureArgs
  ): Promise<Feature[]> {
    const query = FeatureModel.find()
    const filters: any[] = []

    if (name) {
      filters.push({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
    }
    if (level) {
      const levelQuery = buildMongoQueryFromNumberFilter(level)
      if (levelQuery) {
        filters.push({ level: levelQuery })
      }
    }
    if (classIndices && classIndices.length > 0) {
      filters.push({ 'class.index': { $in: classIndices } })
    }
    if (subclassIndices && subclassIndices.length > 0) {
      filters.push({ 'subclass.index': { $in: subclassIndices } })
    }

    if (filters.length > 0) {
      query.where({ $and: filters })
    }

    if (order_direction) {
      const sortOrder = order_direction === OrderByDirection.DESC ? -1 : 1
      const sortField = order_by ? FEATURE_SORT_FIELD_MAP[order_by] : 'name'

      if (sortField) {
        query.sort({ [sortField]: sortOrder })
      } else if (order_by) {
        console.warn(
          `FeatureResolver: Missing sort field mapping for order_by: ${order_by}. Defaulting to sort by name.`
        )
        query.sort({ name: sortOrder })
      }
    }

    // TODO: Pass 5 - Implement pagination properly
    // if (skip !== undefined) query.skip(skip);
    // if (limit !== undefined) query.limit(limit);

    return query.lean()
  }

  @Query(() => Feature, { nullable: true, description: 'Gets a single feature by its index.' })
  async feature(@Arg('index', () => String) index: string): Promise<Feature | null> {
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
