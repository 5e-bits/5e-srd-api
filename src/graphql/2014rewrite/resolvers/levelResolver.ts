import {
  Resolver,
  Query,
  Arg,
  Args,
  ArgsType,
  Field,
  Int,
  registerEnumType,
  FieldResolver,
  Root
} from 'type-graphql'
import { IsOptional, IsString, IsArray, IsEnum, ValidateNested, Min, IsInt } from 'class-validator'
import { Type } from 'class-transformer'

import LevelModel, { Level } from '@/models/2014/level'
import ClassModel, { Class } from '@/models/2014/class'
import SubclassModel, { Subclass } from '@/models/2014/subclass'
import FeatureModel, { Feature } from '@/models/2014/feature'

import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import {
  NumberFilterInput,
  buildMongoQueryFromNumberFilter,
  buildMongoSortQuery
} from '@/graphql/2014rewrite/common/inputs'
import {
  resolveMultipleReferences,
  resolveSingleReference
} from '@/graphql/2014rewrite/utils/resolvers'

export enum LevelOrderField {
  LEVEL = 'level',
  CLASS = 'class',
  SUBCLASS = 'subclass'
}

registerEnumType(LevelOrderField, {
  name: 'LevelOrderField',
  description: 'Fields to sort Levels by'
})

const LEVEL_SORT_FIELD_MAP: Record<LevelOrderField, string> = {
  [LevelOrderField.LEVEL]: 'level',
  [LevelOrderField.CLASS]: 'class.name',
  [LevelOrderField.SUBCLASS]: 'subclass.name'
}

@ArgsType()
class LevelArgs {
  @Field(() => [String], { nullable: true, description: 'Filter by one or more class indices' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  class?: string[]

  @Field(() => [String], { nullable: true, description: 'Filter by one or more subclass indices' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subclass?: string[]

  @Field(() => NumberFilterInput, {
    nullable: true,
    description: 'Filter by level. Allows exact match, list, or range.'
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => NumberFilterInput)
  level?: NumberFilterInput

  @Field(() => Int, {
    nullable: true,
    description: 'Filter by the exact number of ability score bonuses granted at this level.'
  })
  @IsOptional()
  @IsInt()
  ability_score_bonuses?: number

  @Field(() => Int, {
    nullable: true,
    description: 'Filter by the exact proficiency bonus at this level.'
  })
  @IsOptional()
  @IsInt()
  prof_bonus?: number

  @Field(() => LevelOrderField, { nullable: true, description: 'Field to sort levels by.' })
  @IsOptional()
  @IsEnum(LevelOrderField)
  order_by?: LevelOrderField

  @Field(() => OrderByDirection, {
    nullable: true,
    defaultValue: OrderByDirection.ASC,
    description: 'Sort direction for the chosen field (default: ASC)'
  })
  @IsOptional()
  @IsEnum(OrderByDirection)
  order_direction?: OrderByDirection
}

@Resolver(Level)
export class LevelResolver {
  @Query(() => Level, {
    nullable: true,
    description:
      'Gets a single level by its combined index (e.g., wizard-3-evocation or fighter-5).'
  })
  async level(@Arg('index', () => String) index: string): Promise<Level | null> {
    return LevelModel.findOne({ index }).lean()
  }

  @Query(() => [Level], { description: 'Gets all levels, optionally filtered and sorted.' })
  async levels(@Args() args: LevelArgs): Promise<Level[]> {
    const {
      class: classIndices,
      subclass: subclassIndices,
      level,
      ability_score_bonuses,
      prof_bonus,
      order_by,
      order_direction
    } = args
    let query = LevelModel.find()
    const filters: any[] = []

    if (classIndices && classIndices.length > 0) {
      filters.push({ 'class.index': { $in: classIndices } })
    }

    if (subclassIndices && subclassIndices.length > 0) {
      filters.push({ 'subclass.index': { $in: subclassIndices } })
    }

    if (level) {
      const levelQuery = buildMongoQueryFromNumberFilter(level)
      if (levelQuery) {
        filters.push({ level: levelQuery })
      }
    }

    if (ability_score_bonuses) {
      filters.push({ ability_score_bonuses })
    }

    if (prof_bonus) {
      filters.push({ prof_bonus })
    }

    if (filters.length > 0) {
      query = query.where({ $and: filters })
    }

    const sortQuery = buildMongoSortQuery({
      orderBy: order_by,
      orderDirection: order_direction,
      sortFieldMap: LEVEL_SORT_FIELD_MAP,
      defaultSortField: 'level'
    })

    if (sortQuery) {
      query = query.sort(sortQuery)
    }

    return query.lean()
  }

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
