import { Resolver, Query, Arg, Args } from 'type-graphql'
import { Condition } from '@/models/2014/condition' // Import the decorated model class
import ConditionModel from '@/models/2014/condition' // Import the default export for data access
import { BaseResolver } from '@/graphql/common/resolvers/BaseResolver'
import { NameSortArgs } from '@/graphql/common/args/NameSortArgs'

@Resolver(Condition)
export class ConditionResolver extends BaseResolver<Condition> {
  constructor() {
    super(ConditionModel, Condition)
  }

  @Query(() => Condition, {
    nullable: true,
    description: 'Gets a single condition by index.'
  })
  async condition(@Arg('index', () => String) index: string): Promise<Condition | null> {
    return this._findOneByIndex(index)
  }

  @Query(() => [Condition], {
    description: 'Gets all conditions, optionally filtered and sorted.'
  })
  async conditions(@Args(() => NameSortArgs) args: NameSortArgs): Promise<Condition[]> {
    return this._find(args)
  }
}
