import { Resolver, Query, Arg, Args, ArgsType, Field, Int } from 'type-graphql'
import { z } from 'zod'
import MagicSchoolModel, { MagicSchool } from '@/models/2014/magicSchool'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { escapeRegExp } from '@/util'
import { buildMongoSortQuery } from '@/graphql/2014rewrite/common/inputs'

// Zod schema for MagicSchoolArgs
const MagicSchoolArgsSchema = z.object({
  name: z.string().optional(),
  order_direction: z.nativeEnum(OrderByDirection).optional().default(OrderByDirection.ASC),
  skip: z.number().int().min(0).optional(),
  limit: z.number().int().min(1).optional()
})

// Zod schema for MagicSchool index argument
const MagicSchoolIndexArgsSchema = z.object({
  index: z.string().min(1, { message: 'Index must be a non-empty string' })
})

@ArgsType()
class MagicSchoolArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by magic school name (case-insensitive, partial match)'
  })
  name?: string

  @Field(() => OrderByDirection, {
    nullable: true,
    description: 'Sort direction (default: ASC for name)'
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

@Resolver(MagicSchool)
export class MagicSchoolResolver {
  @Query(() => [MagicSchool], {
    description: 'Gets all magic schools, optionally filtered by name and sorted by name.'
  })
  async magicSchools(@Args() args: MagicSchoolArgs): Promise<MagicSchool[]> {
    const validatedArgs = MagicSchoolArgsSchema.parse(args)

    const query = MagicSchoolModel.find()

    if (validatedArgs.name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    const sortQuery = buildMongoSortQuery({
      orderDirection: validatedArgs.order_direction,
      defaultSortField: 'name'
    })

    if (sortQuery) {
      query.sort(sortQuery)
    }
    // TODO: Pass 5 - Implement pagination
    // if (skip) query.skip(skip);
    // if (limit) query.limit(limit);

    return query.lean()
  }

  @Query(() => MagicSchool, { nullable: true, description: 'Gets a single magic school by index.' })
  async magicSchool(@Arg('index', () => String) indexInput: string): Promise<MagicSchool | null> {
    const { index } = MagicSchoolIndexArgsSchema.parse({ index: indexInput })
    return MagicSchoolModel.findOne({ index }).lean()
  }
}
