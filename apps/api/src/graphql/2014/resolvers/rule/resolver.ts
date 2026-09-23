import { FieldResolver, Resolver, Root } from 'type-graphql'

import { createResolver } from '@/graphql/common/createResolver'
import { resolveMultipleReferences, resolveSingleReference } from '@/graphql/utils/resolvers'
import RuleModel, { Rule } from '@/models/2014/rule'

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
  @FieldResolver(() => Rule, { nullable: true })
  async parent(@Root() rule: Rule): Promise<Rule | null> {
    return resolveSingleReference(rule.parent, RuleModel)
  }

  @FieldResolver(() => [Rule], { nullable: true })
  async children(@Root() rule: Rule): Promise<Rule[] | null> {
    if (!rule.children) return null
    const order = rule.children.map((c) => c.index)
    const children: Rule[] = await resolveMultipleReferences(rule.children, RuleModel)
    return children.sort((a, b) => order.indexOf(a.index) - order.indexOf(b.index))
  }
}
