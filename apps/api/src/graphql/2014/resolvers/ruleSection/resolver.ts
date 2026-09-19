import { Resolver } from 'type-graphql'

import { createResolver } from '@/graphql/common/createResolver'
import RuleSectionModel, { RuleSection } from '@/models/2014/ruleSection'

@Resolver(RuleSection)
export class RuleSectionResolver extends createResolver({
  Type: RuleSection,
  Model: RuleSectionModel,
  typeName: 'RuleSection',
  singular: 'ruleSection',
  plural: 'ruleSections',
  descriptions: {
    fields: 'Fields to sort Rule Sections by',
    order: 'Specify sorting order for rule sections. Allows nested sorting.',
    list: 'Gets all rule sections, optionally filtered by name and sorted by name.',
    single: 'Gets a single rule section by index.'
  },
  defaultSort: false
}) {}
