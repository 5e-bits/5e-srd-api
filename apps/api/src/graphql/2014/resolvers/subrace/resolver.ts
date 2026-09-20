import { FieldResolver, Resolver, Root } from 'type-graphql'

import { createResolver } from '@/graphql/common/createResolver'
import { resolveMultipleReferences, resolveSingleReference } from '@/graphql/utils/resolvers'
import AbilityScoreModel, { AbilityScore } from '@/models/2014/abilityScore'
import RaceModel, { Race } from '@/models/2014/race'
import SubraceModel, { Subrace, SubraceAbilityBonus } from '@/models/2014/subrace'
import TraitModel, { Trait } from '@/models/2014/trait'

@Resolver(Subrace)
export class SubraceResolver extends createResolver({
  Type: Subrace,
  Model: SubraceModel,
  typeName: 'Subrace',
  singular: 'subrace',
  plural: 'subraces',
  descriptions: {
    fields: 'Fields to sort Subraces by',
    order: 'Specify sorting order for subraces.',
    list: 'Gets all subraces, optionally filtered by name and sorted by name.',
    single: 'Gets a single subrace by index.'
  }
}) {
  @FieldResolver(() => Race, { nullable: true })
  async race(@Root() subrace: Subrace): Promise<Race | null> {
    return resolveSingleReference(subrace.race, RaceModel)
  }

  @FieldResolver(() => [Trait], { nullable: true })
  async racial_traits(@Root() subrace: Subrace): Promise<Trait[]> {
    return resolveMultipleReferences(subrace.racial_traits, TraitModel)
  }
}
@Resolver(SubraceAbilityBonus)
export class SubraceAbilityBonusResolver {
  @FieldResolver(() => AbilityScore, { nullable: true })
  async ability_score(
    @Root() subraceAbilityBonus: SubraceAbilityBonus
  ): Promise<AbilityScore | null> {
    return resolveSingleReference(subraceAbilityBonus.ability_score, AbilityScoreModel)
  }
}
