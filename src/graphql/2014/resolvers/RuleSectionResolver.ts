import { Resolver, Query, Arg, Args } from 'type-graphql'
import { RuleSection } from '@/models/2014/ruleSection'
import RuleSectionModel from '@/models/2014/ruleSection'
import { BaseResolver } from '@/graphql/common/resolvers/BaseResolver'
import { NameSortArgs } from '@/graphql/common/args/NameSortArgs'

@Resolver(RuleSection)
export class RuleSectionResolver extends BaseResolver<RuleSection> {
  constructor() {
    super(RuleSectionModel, RuleSection)
  }

  @Query(() => RuleSection, {
    nullable: true,
    description: 'Gets a single rule section by index.'
  })
  async ruleSection(@Arg('index', () => String) index: string): Promise<RuleSection | null> {
    return this._findOneByIndex(index)
  }

  @Query(() => [RuleSection], {
    description: 'Gets all rule sections, optionally filtered and sorted.'
  })
  async ruleSections(@Args(() => NameSortArgs) args: NameSortArgs): Promise<RuleSection[]> {
    return this._find(args)
  }
}
