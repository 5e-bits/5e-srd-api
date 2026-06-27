import { Args, Query, Resolver } from 'type-graphql'

import { buildSortPipeline } from '@/graphql/common/args'
import { buildMongoQueryFromNumberFilter } from '@/graphql/common/inputs'
import Poison2024Model, { Poison2024 } from '@/models/2024/poison'
import { escapeRegExp } from '@/util'

import {
  POISON_SORT_FIELD_MAP,
  PoisonArgs,
  PoisonArgsSchema,
  PoisonIndexArgs,
  PoisonIndexArgsSchema,
  PoisonOrderField
} from './args'

@Resolver(Poison2024)
export class PoisonResolver {
  @Query(() => [Poison2024], {
    description: 'Gets all 2024 poisons, optionally filtered and sorted.'
  })
  async poisons(@Args(() => PoisonArgs) args: PoisonArgs): Promise<Poison2024[]> {
    const validatedArgs = PoisonArgsSchema.parse(args)

    const query = Poison2024Model.find()
    const filters: any[] = []

    if (validatedArgs.name != null && validatedArgs.name !== '') {
      filters.push({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }
    if (validatedArgs.type && validatedArgs.type.length > 0) {
      filters.push({ type: { $in: validatedArgs.type } })
    }
    if (validatedArgs.cost) {
      const costQuery = buildMongoQueryFromNumberFilter(validatedArgs.cost)
      if (costQuery) {
        filters.push({ cost: costQuery })
      }
    }

    if (filters.length > 0) {
      query.where({ $and: filters })
    }

    const sortQuery = buildSortPipeline<PoisonOrderField>({
      order: validatedArgs.order,
      sortFieldMap: POISON_SORT_FIELD_MAP,
      defaultSortField: PoisonOrderField.NAME
    })

    if (Object.keys(sortQuery).length > 0) {
      query.sort(sortQuery)
    }

    if (validatedArgs.skip !== undefined) {
      query.skip(validatedArgs.skip)
    }
    if (validatedArgs.limit !== undefined) {
      query.limit(validatedArgs.limit)
    }

    return query.lean()
  }

  @Query(() => Poison2024, {
    nullable: true,
    description: 'Gets a single 2024 poison by index.'
  })
  async poison(@Args(() => PoisonIndexArgs) args: PoisonIndexArgs): Promise<Poison2024 | null> {
    const { index } = PoisonIndexArgsSchema.parse(args)
    return Poison2024Model.findOne({ index }).lean()
  }
}
