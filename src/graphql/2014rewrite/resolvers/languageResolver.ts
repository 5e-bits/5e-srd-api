import { Resolver, Query, Arg, Args, ArgsType, Field, Int, registerEnumType } from 'type-graphql'
import LanguageModel, { Language } from '@/models/2014/language'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { IsOptional, IsString, IsArray, IsEnum, Min, Max } from 'class-validator'
import { escapeRegExp } from '@/util'
import { buildMongoSortQuery } from '@/graphql/2014rewrite/common/inputs'

export enum LanguageOrderField {
  NAME = 'name',
  TYPE = 'type',
  SCRIPT = 'script'
}

registerEnumType(LanguageOrderField, {
  name: 'LanguageOrderField',
  description: 'Fields to sort Languages by'
})

const LANGUAGE_SORT_FIELD_MAP: Record<LanguageOrderField, string> = {
  [LanguageOrderField.NAME]: 'name',
  [LanguageOrderField.TYPE]: 'type',
  [LanguageOrderField.SCRIPT]: 'script'
}

@ArgsType()
class LanguageArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by language name (case-insensitive, partial match)'
  })
  @IsOptional()
  @IsString()
  name?: string

  @Field(() => String, {
    nullable: true,
    description:
      'Filter by language type (e.g., Standard, Exotic) - case-insensitive exact match after normalization'
  })
  @IsOptional()
  @IsString()
  type?: string

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by one or more language scripts (e.g., ["Common", "Elvish"])'
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  script?: string[]

  @Field(() => LanguageOrderField, {
    nullable: true,
    description: 'Field to sort languages by.'
  })
  @IsOptional()
  @IsEnum(LanguageOrderField)
  order_by?: LanguageOrderField

  @Field(() => OrderByDirection, {
    nullable: true,
    defaultValue: OrderByDirection.ASC,
    description: 'Sort direction for the chosen field (default: ASC)'
  })
  @IsOptional()
  @IsEnum(OrderByDirection)
  order_direction?: OrderByDirection

  @Field(() => Int, { nullable: true, description: 'Number of results to skip for pagination' })
  @IsOptional()
  skip?: number

  @Field(() => Int, { nullable: true, description: 'Maximum number of results to return' })
  @IsOptional()
  limit?: number
}

@Resolver(Language)
export class LanguageResolver {
  @Query(() => Language, { nullable: true, description: 'Gets a single language by its index.' })
  async language(@Arg('index', () => String) index: string): Promise<Language | null> {
    return LanguageModel.findOne({ index }).lean()
  }

  @Query(() => [Language], { description: 'Gets all languages, optionally filtered and sorted.' })
  async languages(
    @Args() { name, type, script, order_by, order_direction, skip, limit }: LanguageArgs
  ): Promise<Language[]> {
    const query = LanguageModel.find()
    const filters: any[] = []

    if (name) {
      filters.push({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
    }

    if (type) {
      const normalizedType = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
      filters.push({ type: normalizedType })
    }

    if (script && script.length > 0) {
      filters.push({ script: { $in: script } })
    }

    if (filters.length > 0) {
      query.where({ $and: filters })
    }

    const sortQuery = buildMongoSortQuery({
      orderBy: order_by,
      orderDirection: order_direction,
      sortFieldMap: LANGUAGE_SORT_FIELD_MAP,
      defaultSortField: 'name'
    })
    if (sortQuery) {
      query.sort(sortQuery)
    }

    // TODO: Pass 5 - Implement pagination properly
    // if (skip !== undefined) query.skip(skip);
    // if (limit !== undefined) query.limit(limit);

    return query.lean()
  }
}
