import { Arg, Args, Query, Resolver } from 'type-graphql'

import { buildSortPipeline } from '@/graphql/common/args'
import ConditionModel, { Condition } from '@/models/2014/condition'
import { escapeRegExp } from '@/util'

import {
  CONDITION_SORT_FIELD_MAP,
  ConditionArgs,
  ConditionArgsSchema,
  ConditionIndexArgsSchema,
  ConditionOrderField
} from './args'

@Resolver(Condition)
export class ConditionResolver {
  @Query(() => [Condition], {
    description: 'Gets all conditions, optionally filtered by name and sorted by name.'
  })
  async conditions(@Args(() => ConditionArgs) args: ConditionArgs): Promise<Condition[]> {
    const validatedArgs = ConditionArgsSchema.parse(args)
    const query = ConditionModel.find()

    if (validatedArgs.name != null && validatedArgs.name !== '') {
      query.where({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    const sortQuery = buildSortPipeline<ConditionOrderField>({
      order: validatedArgs.order,
      sortFieldMap: CONDITION_SORT_FIELD_MAP,
      defaultSortField: ConditionOrderField.NAME
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

  @Query(() => Condition, { nullable: true, description: 'Gets a single condition by index.' })
  async condition(@Arg('index', () => String) indexInput: string): Promise<Condition | null> {
    const { index } = ConditionIndexArgsSchema.parse({ index: indexInput })
    return ConditionModel.findOne({ index }).lean()
  }
}
