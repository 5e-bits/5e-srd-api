import { Resolver, Query, Arg, Args, ArgsType, Field, Int, FieldResolver, Root } from 'type-graphql'
import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator'
import { FilterQuery } from 'mongoose'
import LevelModel, { Level } from '@/models/2014/level'
import ClassModel, { Class } from '@/models/2014/class'
import FeatureModel, { Feature } from '@/models/2014/feature'
import SubclassModel, { Subclass } from '@/models/2014/subclass'
import {
  resolveMultipleReferences,
  resolveSingleReference
} from '@/graphql/2014rewrite/utils/resolvers'

@ArgsType()
class LevelArgs {
  @Field(() => Int, { nullable: true, description: 'Filter by a specific level (1-20)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  level?: number

  @Field(() => Int, { nullable: true, description: 'Filter by proficiency bonus' })
  @IsOptional()
  @IsInt()
  prof_bonus?: number

  @Field(() => Int, {
    nullable: true,
    description: 'Filter by number of ability score bonuses'
  })
  @IsOptional()
  @IsInt()
  ability_score_bonuses?: number

  @Field(() => String, { nullable: true, description: 'Filter by class index (e.g., barbarian)' })
  @IsOptional()
  @IsString()
  class_index?: string

  @Field(() => String, {
    nullable: true,
    description: 'Filter by subclass index (e.g., berserker)'
  })
  @IsOptional()
  @IsString()
  subclass_index?: string
}

@Resolver(Level)
export class LevelResolver {
  @Query(() => [Level], {
    description:
      'Gets levels, optionally filtering by level, proficiency bonus, ability score bonuses, class, or subclass.'
  })
  async levels(
    @Args() { level, prof_bonus, ability_score_bonuses, class_index, subclass_index }: LevelArgs
  ): Promise<Level[]> {
    const filter: FilterQuery<Level> = {}

    if (level !== undefined) {
      filter.level = level
    }

    if (prof_bonus !== undefined) {
      filter.prof_bonus = prof_bonus
    }

    if (ability_score_bonuses !== undefined) {
      filter.ability_score_bonuses = ability_score_bonuses
    }

    if (class_index !== undefined) {
      const classDoc = await ClassModel.findOne({ index: class_index }).select('_id').lean()
      if (classDoc) {
        filter.class = classDoc._id
      } else {
        // If class_index is provided but no class is found, return no levels
        return []
      }
    }

    if (subclass_index !== undefined) {
      const subclassDoc = await SubclassModel.findOne({ index: subclass_index })
        .select('_id')
        .lean()
      if (subclassDoc) {
        filter.subclass = subclassDoc._id
      } else {
        // If subclass_index is provided but no subclass is found, return no levels
        return []
      }
    }

    // Always sort by level number
    const query = LevelModel.find(filter).sort({ level: 1 })

    return query.lean()
  }

  @Query(() => Level, {
    nullable: true,
    description: 'Gets a single level by its composite index (e.g., barbarian-1).'
  })
  async level(@Arg('index', () => String) index: string): Promise<Level | null> {
    return LevelModel.findOne({ index }).lean()
  }

  @FieldResolver(() => Class, { nullable: true })
  async class(@Root() level: Level): Promise<Class | null> {
    return resolveSingleReference(level.class, ClassModel)
  }

  @FieldResolver(() => [Feature], { nullable: true })
  async features(@Root() level: Level): Promise<Feature[]> {
    return resolveMultipleReferences(level.features, FeatureModel)
  }

  @FieldResolver(() => Subclass, { nullable: true })
  async subclass(@Root() level: Level): Promise<Subclass | null> {
    return resolveSingleReference(level.subclass, SubclassModel)
  }
}
