import { Resolver, Query, Arg, Args, FieldResolver, Root } from 'type-graphql'
import { Rule } from '@/models/2014/rule'
import RuleModel from '@/models/2014/rule'
import { RuleSection } from '@/models/2014/ruleSection'
import RuleSectionModel from '@/models/2014/ruleSection'
import { BaseResolver } from '@/graphql/common/resolvers/BaseResolver'
import { NameSortArgs } from '@/graphql/common/args/NameSortArgs'

@Resolver(Rule)
export class RuleResolver extends BaseResolver<Rule> {
  constructor() {
    super(RuleModel, Rule)
  }

  @Query(() => Rule, {
    nullable: true,
    description: 'Gets a single rule by index (e.g., adventuring).'
  })
  async rule(@Arg('index', () => String) index: string): Promise<Rule | null> {
    return this._findOneByIndex(index)
  }

  @Query(() => [Rule], {
    description: 'Gets all rules, optionally filtered and sorted.'
  })
  async rules(@Args(() => NameSortArgs) args: NameSortArgs): Promise<Rule[]> {
    return this._find(args)
  }

  // Field resolver for the 'subsections' field on Rule
  @FieldResolver(() => [RuleSection], {
    description: 'Subsections detailing specific aspects of this rule.'
  })
  async subsections(@Root() rule: Rule): Promise<RuleSection[]> {
    // Get the indices from the APIReferences
    const subsectionIndices = rule.subsections.map((ref) => ref.index)
    if (!subsectionIndices || subsectionIndices.length === 0) {
      return []
    }

    // Find RuleSection documents that match the indices
    return RuleSectionModel.find({ index: { $in: subsectionIndices } }).lean()
  }
}
