import { FieldResolver, Resolver, Root } from 'type-graphql'

import { resolveSingleReference } from '@/graphql/utils/resolvers'
import AbilityScoreModel, { AbilityScore2024 } from '@/models/2024/abilityScore'
import { DifficultyClass } from '@/models/common/difficultyClass'

@Resolver(() => DifficultyClass)
export class DifficultyClassResolver {
  @FieldResolver(() => AbilityScore2024, { nullable: true })
  async dc_type(@Root() dc: DifficultyClass): Promise<AbilityScore2024 | null> {
    return resolveSingleReference(dc.dc_type, AbilityScoreModel)
  }
}
