import { Resolver, Query, Arg, Args } from 'type-graphql'
import ConditionModel, { Condition } from '@/models/2014/condition'
import { escapeRegExp } from '@/util'
import { buildMongoSortQuery } from '@/graphql/2014/common/inputs'
import { ConditionArgs, ConditionArgsSchema, ConditionIndexArgsSchema } from './args'

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
      orderDirection: validatedArgs.order_direction,
      defaultSortField: 'name'
    })

    if (sortQuery) {
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
  async condition(@Arg('index') indexInput: string): Promise<Condition | null> {
    const { index } = ConditionIndexArgsSchema.parse({ index: indexInput })
    return ConditionModel.findOne({ index }).lean()
  }
}
