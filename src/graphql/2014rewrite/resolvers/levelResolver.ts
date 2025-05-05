import { Resolver, Query, Arg, Args, ArgsType, Field, Int } from 'type-graphql'
import { IsOptional, IsInt, Min, Max } from 'class-validator'
import { FilterQuery } from 'mongoose'
import LevelModel, { Level } from '@/models/2014/level'

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

  // TODO: Add class filter in Pass 2
  // TODO: Add subclass filter in Pass 2
}

@Resolver(Level)
export class LevelResolver {
  @Query(() => [Level], {
    description:
      'Gets levels, optionally filtering by level, proficiency bonus, or ability score bonuses.'
  })
  async levels(@Args() { level, prof_bonus, ability_score_bonuses }: LevelArgs): Promise<Level[]> {
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

  // TODO: Pass 2 - Field resolvers for references (class, features, subclass)
  // TODO: Pass 2/3 - Field resolvers for complex types (class_specific, spellcasting, subclass_specific)
}
