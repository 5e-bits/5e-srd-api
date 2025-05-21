import { Resolver, Query, Arg, Args } from 'type-graphql'
import AlignmentModel, { Alignment } from '@/models/2014/alignment'
import { escapeRegExp } from '@/util'
import { buildMongoSortQuery } from '../../common/inputs'

import { AlignmentArgs, AlignmentArgsSchema, AlignmentIndexArgsSchema } from './args'

@Resolver(Alignment)
export class AlignmentResolver {
  @Query(() => [Alignment], {
    description: 'Gets all alignments, optionally filtered by name and sorted.'
  })
  async alignments(@Args() args: AlignmentArgs): Promise<Alignment[]> {
    const validatedArgs = AlignmentArgsSchema.parse(args)

    const query = AlignmentModel.find()

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

    // Implement pagination
    if (validatedArgs.skip) {
      query.skip(validatedArgs.skip)
    }
    if (validatedArgs.limit) {
      query.limit(validatedArgs.limit)
    }

    return query.lean()
  }

  @Query(() => Alignment, { nullable: true, description: 'Gets a single alignment by index.' })
  async alignment(@Arg('index') indexInput: string): Promise<Alignment | null> {
    const { index } = AlignmentIndexArgsSchema.parse({ index: indexInput })
    return AlignmentModel.findOne({ index }).lean()
  }
}
