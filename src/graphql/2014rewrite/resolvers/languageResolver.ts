import { Resolver, Query, Arg, Args, ArgsType, Field, Int, registerEnumType } from 'type-graphql'
import { z } from 'zod'
import LanguageModel, { Language } from '@/models/2014/language'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
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

const LanguageArgsSchema = z.object({
  name: z.string().optional(),
  type: z
    .string()
    .optional()
    .transform((val) => {
      if (typeof val === 'string' && val.length > 0) {
        return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
      }
      return undefined
    }),
  script: z.array(z.string()).optional(),
  order_by: z.nativeEnum(LanguageOrderField).optional(),
  order_direction: z.nativeEnum(OrderByDirection).optional().default(OrderByDirection.ASC),
  skip: z.number().int().min(0).optional(),
  limit: z.number().int().min(1).optional()
})

const LanguageIndexArgsSchema = z.object({
  index: z.string().min(1, { message: 'Index must be a non-empty string' })
})

@ArgsType()
class LanguageArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by language name (case-insensitive, partial match)'
  })
  name?: string

  @Field(() => String, {
    nullable: true,
    description:
      'Filter by language type (e.g., Standard, Exotic) - case-insensitive exact match after normalization'
  })
  type?: string

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by one or more language scripts (e.g., ["Common", "Elvish"])'
  })
  script?: string[]

  @Field(() => LanguageOrderField, {
    nullable: true,
    description: 'Field to sort languages by.'
  })
  order_by?: LanguageOrderField

  @Field(() => OrderByDirection, {
    nullable: true,
    description: 'Sort direction for the chosen field (default: ASC)'
  })
  order_direction?: OrderByDirection

  @Field(() => Int, { nullable: true, description: 'TODO: Pass 5 - Number of results to skip' })
  skip?: number

  @Field(() => Int, {
    nullable: true,
    description: 'TODO: Pass 5 - Maximum number of results to return'
  })
  limit?: number
}

@Resolver(Language)
export class LanguageResolver {
  @Query(() => Language, { nullable: true, description: 'Gets a single language by its index.' })
  async language(@Arg('index', () => String) indexInput: string): Promise<Language | null> {
    const { index } = LanguageIndexArgsSchema.parse({ index: indexInput })
    return LanguageModel.findOne({ index }).lean()
  }

  @Query(() => [Language], { description: 'Gets all languages, optionally filtered and sorted.' })
  async languages(@Args() args: LanguageArgs): Promise<Language[]> {
    const validatedArgs = LanguageArgsSchema.parse(args)

    const query = LanguageModel.find()
    const filters: any[] = []

    if (validatedArgs.name) {
      filters.push({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    if (validatedArgs.type) {
      filters.push({ type: validatedArgs.type })
    }

    if (validatedArgs.script && validatedArgs.script.length > 0) {
      filters.push({ script: { $in: validatedArgs.script } })
    }

    if (filters.length > 0) {
      query.where({ $and: filters })
    }

    const sortQuery = buildMongoSortQuery({
      orderBy: validatedArgs.order_by,
      orderDirection: validatedArgs.order_direction,
      sortFieldMap: LANGUAGE_SORT_FIELD_MAP,
      defaultSortField: LanguageOrderField.NAME
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
