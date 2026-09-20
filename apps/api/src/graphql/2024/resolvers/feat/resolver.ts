import { FieldResolver, Resolver, Root } from 'type-graphql'

import { ScorePrerequisiteChoice2024 } from '@/graphql/2024/common/choiceTypes'
import { resolveScorePrerequisiteChoice } from '@/graphql/2024/utils/choiceResolvers'
import { createResolver } from '@/graphql/common/createResolver'
import { inFilter, regexFilter } from '@/graphql/common/filters'
import FeatModel, { Feat2024 } from '@/models/2024/feat'

import { FeatArgs, FeatArgsSchema } from './args'

@Resolver(Feat2024)
export class FeatResolver extends createResolver({
  Type: Feat2024,
  Model: FeatModel,
  typeName: 'Feat',
  singular: 'feat',
  plural: 'feats',
  descriptions: {
    fields: 'Fields to sort Feats by',
    order: 'Specify sorting order for feats.',
    list: 'Gets all feats, optionally filtered by name and type.',
    single: 'Gets a single feat by index.'
  },
  orderFields: {
    NAME: { value: 'name', path: 'name' },
    TYPE: { value: 'type', path: 'type' }
  },
  defaultSort: 'NAME',
  Args: FeatArgs,
  argsSchema: FeatArgsSchema,
  filters: (a) => [regexFilter('name', a.name), inFilter('type', a.type)]
}) {
  @FieldResolver(() => ScorePrerequisiteChoice2024, { nullable: true })
  async prerequisite_options(@Root() feat: Feat2024): Promise<ScorePrerequisiteChoice2024 | null> {
    return resolveScorePrerequisiteChoice(feat.prerequisite_options)
  }
}
