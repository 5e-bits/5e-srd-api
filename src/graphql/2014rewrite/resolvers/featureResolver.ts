import { Resolver, Query, Arg, Args, ArgsType, Field, Int, FieldResolver, Root } from 'type-graphql'
import { IsOptional, IsString, IsEnum, Min } from 'class-validator'
import FeatureModel, {
  Feature,
  FeatureSpecific,
  LevelPrerequisite,
  FeaturePrerequisite,
  SpellPrerequisite,
  Prerequisite
} from '@/models/2014/feature'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { escapeRegExp } from '@/util'
import ClassModel, { Class } from '@/models/2014/class'
import SubclassModel, { Subclass } from '@/models/2014/subclass'
import {
  resolveMultipleReferences,
  resolveSingleReference
} from '@/graphql/2014rewrite/utils/resolvers'
import SpellModel, { Spell } from '@/models/2014/spell'
import { FeaturePrerequisiteUnion } from '@/graphql/2014rewrite/common/unions'

@ArgsType()
class FeatureArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by feature name (case-insensitive, partial match)'
  })
  @IsOptional()
  @IsString()
  name?: string

  @Field(() => Int, { nullable: true, description: 'Filter by minimum level required' })
  @IsOptional()
  @Min(1)
  level?: number

  @Field(() => String, { nullable: true, description: 'Filter by associated class index' })
  @IsOptional()
  @IsString()
  class?: string

  @Field(() => String, { nullable: true, description: 'Filter by associated subclass index' })
  @IsOptional()
  @IsString()
  subclass?: string

  @Field(() => OrderByDirection, {
    nullable: true,
    defaultValue: OrderByDirection.ASC,
    description: 'Sort direction for the name field (default: ASC)'
  })
  @IsOptional()
  @IsEnum(OrderByDirection)
  order_direction?: OrderByDirection
}

@Resolver(Feature)
export class FeatureResolver {
  @Query(() => [Feature], {
    description: 'Gets all features, optionally filtered and sorted.'
  })
  async features(
    @Args() { name, level, class: className, subclass: subclassName, order_direction }: FeatureArgs
  ): Promise<Feature[]> {
    const query = FeatureModel.find()
    const filters: any = {}

    if (name) {
      filters.name = { $regex: new RegExp(escapeRegExp(name), 'i') }
    }
    if (level !== undefined) {
      filters.level = { $gte: level }
    }
    if (className) {
      filters['class.index'] = className
    }
    if (subclassName) {
      filters['subclass.index'] = subclassName
    }

    if (Object.keys(filters).length > 0) {
      query.where(filters)
    }

    if (order_direction) {
      const sortOrder = order_direction === OrderByDirection.DESC ? -1 : 1
      query.sort({ name: sortOrder })
    }

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
