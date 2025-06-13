import { Arg, Args, Query, Resolver } from 'type-graphql'

import { buildSortPipeline } from '@/graphql/common/args'
import AlignmentModel, { Alignment2024 } from '@/models/2024/alignment'
import { escapeRegExp } from '@/util'

import {
  ALIGNMENT_SORT_FIELD_MAP,
  AlignmentArgs,
  AlignmentArgsSchema,
  AlignmentIndexArgsSchema,
  AlignmentOrderField
} from './args'

@Resolver(Alignment2024)
export class AlignmentResolver {
  @Query(() => [Alignment2024], {
    description: 'Gets all alignments, optionally filtered by name and sorted.'
  })
  async alignments(@Args(() => AlignmentArgs) args: AlignmentArgs): Promise<Alignment2024[]> {
    const validatedArgs = AlignmentArgsSchema.parse(args)

    const query = AlignmentModel.find()

    if (validatedArgs.name != null && validatedArgs.name !== '') {
      query.where({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    const sortQuery = buildSortPipeline<AlignmentOrderField>({
      order: validatedArgs.order,
      sortFieldMap: ALIGNMENT_SORT_FIELD_MAP,
      defaultSortField: AlignmentOrderField.NAME
    })

    if (Object.keys(sortQuery).length > 0) {
      query.sort(sortQuery)
    }

    if (validatedArgs.skip) {
      query.skip(validatedArgs.skip)
    }
    if (validatedArgs.limit) {
      query.limit(validatedArgs.limit)
    }

    return query.lean()
  }

  @Query(() => Alignment2024, {
    nullable: true,
    description: 'Gets a single alignment by index.'
  })
  async alignment(@Arg('index', () => String) indexInput: string): Promise<Alignment2024 | null> {
    const { index } = AlignmentIndexArgsSchema.parse({ index: indexInput })
    return AlignmentModel.findOne({ index }).lean()
  }
}
