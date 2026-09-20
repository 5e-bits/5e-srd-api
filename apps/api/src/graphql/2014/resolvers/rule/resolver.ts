import { FieldResolver, Resolver, Root } from 'type-graphql'

import { createResolver } from '@/graphql/common/createResolver'
import { resolveMultipleReferences } from '@/graphql/utils/resolvers'
import RuleModel, { Rule } from '@/models/2014/rule'
import RuleSectionModel, { RuleSection } from '@/models/2014/ruleSection'

@Resolver(Rule)
export class RuleResolver extends createResolver({
  Type: Rule,
  Model: RuleModel,
  typeName: 'Rule',
  singular: 'rule',
  plural: 'rules',
  descriptions: {
    fields: 'Fields to sort Rules by',
    order: 'Specify sorting order for rules. Allows nested sorting.',
    list: 'Gets all rules, optionally filtered by name and sorted by name.',
    single: 'Gets a single rule by index.'
  },
  defaultSort: false
}) {
  @FieldResolver(() => [RuleSection])
  async subsections(@Root() rule: Rule): Promise<RuleSection[]> {
    return resolveMultipleReferences(rule.subsections, RuleSectionModel)
  }
}
