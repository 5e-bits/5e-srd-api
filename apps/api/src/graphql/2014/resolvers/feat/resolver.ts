import { FieldResolver, Resolver, Root } from 'type-graphql'

import { createResolver } from '@/graphql/common/createResolver'
import { resolveSingleReference } from '@/graphql/utils/resolvers'
import AbilityScoreModel, { AbilityScore } from '@/models/2014/abilityScore'
import FeatModel, { Feat, Prerequisite } from '@/models/2014/feat'

@Resolver(Feat)
export class FeatResolver extends createResolver({
  Type: Feat,
  Model: FeatModel,
  typeName: 'Feat',
  singular: 'feat',
  plural: 'feats',
  descriptions: {
    fields: 'Fields to sort Feats by',
    order: 'Specify sorting order for feats.',
    list: 'Gets all feats, optionally filtered by name and sorted by name.',
    single: 'Gets a single feat by index.'
  }
}) {}

@Resolver(Prerequisite)
export class PrerequisiteResolver {
  @FieldResolver(() => AbilityScore, { nullable: true })
  async ability_score(@Root() prerequisite: Prerequisite): Promise<AbilityScore | null> {
    return resolveSingleReference(prerequisite.ability_score, AbilityScoreModel)
  }
}
