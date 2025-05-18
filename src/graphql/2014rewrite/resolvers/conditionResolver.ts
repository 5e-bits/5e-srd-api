import { Resolver, Query, Arg, Args, ArgsType, Field, Int } from 'type-graphql'
import { z } from 'zod'
import ConditionModel, { Condition } from '@/models/2014/condition'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { escapeRegExp } from '@/util'
import { buildMongoSortQuery } from '../common/inputs'

// Zod schema for ConditionArgs
const ConditionArgsSchema = z.object({
  name: z.string().optional(),
  order_direction: z.nativeEnum(OrderByDirection).optional().default(OrderByDirection.ASC),
  skip: z.number().int().min(0).optional(),
  limit: z.number().int().min(1).optional()
})

// Zod schema for Condition index argument
const ConditionIndexArgsSchema = z.object({
  index: z.string().min(1, { message: 'Index must be a non-empty string' })
})

// Define ArgsType for the conditions query
@ArgsType()
class ConditionArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by condition name (case-insensitive, partial match)'
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

@Resolver(Condition)
export class ConditionResolver {
  @Query(() => [Condition], {
    description: 'Gets all conditions, optionally filtered by name and sorted by name.'
  })
  async conditions(@Args() args: ConditionArgs): Promise<Condition[]> {
    const validatedArgs = ConditionArgsSchema.parse(args)

    const query = ConditionModel.find()

    if (validatedArgs.name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    const sortQuery = buildMongoSortQuery({
      defaultSortField: 'name',
      orderDirection: validatedArgs.order_direction
    })
    if (sortQuery) {
      query.sort(sortQuery)
    }

    return query.lean()
  }

  @Query(() => Condition, { nullable: true, description: 'Gets a single condition by index.' })
  async condition(@Arg('index', () => String) indexInput: string): Promise<Condition | null> {
    const { index } = ConditionIndexArgsSchema.parse({ index: indexInput })
    return ConditionModel.findOne({ index }).lean()
  }
}
