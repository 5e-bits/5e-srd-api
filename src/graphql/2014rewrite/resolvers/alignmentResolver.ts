import { Resolver, Query, Arg, Args, ArgsType, Field, Int } from 'type-graphql'
import { z } from 'zod'
import AlignmentModel, { Alignment } from '@/models/2014/alignment'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { escapeRegExp } from '@/util'
import { buildMongoSortQuery } from '../common/inputs'

// Zod schema for AlignmentArgs
const AlignmentArgsSchema = z.object({
  name: z.string().optional(),
  order_direction: z.nativeEnum(OrderByDirection).optional().default(OrderByDirection.ASC),
  skip: z.number().int().min(0).optional(),
  limit: z.number().int().min(1).optional()
})

// Zod schema for Alignment index argument
const AlignmentIndexArgsSchema = z.object({
  index: z.string().min(1, { message: 'Index must be a non-empty string' })
})

// Define ArgsType for the alignments query to handle filtering and sorting
@ArgsType()
class AlignmentArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by alignment name (case-insensitive, partial match)'
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

@Resolver(Alignment)
export class AlignmentResolver {
  @Query(() => [Alignment], {
    description: 'Gets all alignments, optionally filtered by name and sorted by name.'
  })
  async alignments(@Args() args: AlignmentArgs): Promise<Alignment[]> {
    const validatedArgs = AlignmentArgsSchema.parse(args)

    const query = AlignmentModel.find()

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

  @Query(() => Alignment, { nullable: true, description: 'Gets a single alignment by index.' })
  async alignment(@Arg('index', () => String) indexInput: string): Promise<Alignment | null> {
    const { index } = AlignmentIndexArgsSchema.parse({ index: indexInput })
    return AlignmentModel.findOne({ index }).lean()
  }
}
