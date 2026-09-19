import { FieldResolver, Resolver, Root } from 'type-graphql'

import { Proficiency2024Choice } from '@/graphql/2024/common/choiceTypes'
import { BackgroundEquipmentChoice2024 } from '@/graphql/2024/types/backgroundEquipment'
import { resolveBackgroundEquipmentChoices } from '@/graphql/2024/utils/backgroundEquipmentResolver'
import { resolveProficiency2024ChoiceArray } from '@/graphql/2024/utils/choiceResolvers'
import { createResolver } from '@/graphql/common/createResolver'
import { resolveMultipleReferences, resolveSingleReference } from '@/graphql/utils/resolvers'
import AbilityScoreModel, { AbilityScore2024 } from '@/models/2024/abilityScore'
import BackgroundModel, { Background2024, BackgroundFeatReference } from '@/models/2024/background'
import FeatModel, { Feat2024 } from '@/models/2024/feat'
import ProficiencyModel, { Proficiency2024 } from '@/models/2024/proficiency'

@Resolver(Background2024)
export class BackgroundResolver extends createResolver({
  Type: Background2024,
  Model: BackgroundModel,
  typeName: 'Background',
  singular: 'background',
  plural: 'backgrounds',
  descriptions: {
    fields: 'Fields to sort Backgrounds by',
    order: 'Specify sorting order for backgrounds.',
    list: 'Gets all backgrounds, optionally filtered by name.',
    single: 'Gets a single background by index.'
  }
}) {
  @FieldResolver(() => [AbilityScore2024])
  async ability_scores(@Root() background: Background2024): Promise<AbilityScore2024[]> {
    return resolveMultipleReferences(background.ability_scores, AbilityScoreModel)
  }

  @FieldResolver(() => Feat2024)
  async feat(@Root() background: Background2024): Promise<Feat2024 | null> {
    return resolveSingleReference(background.feat as BackgroundFeatReference, FeatModel)
  }

  @FieldResolver(() => [Proficiency2024])
  async proficiencies(@Root() background: Background2024): Promise<Proficiency2024[]> {
    return resolveMultipleReferences(background.proficiencies, ProficiencyModel)
  }

  @FieldResolver(() => [Proficiency2024Choice], { nullable: true })
  async proficiency_choices(@Root() background: Background2024): Promise<Proficiency2024Choice[]> {
    return resolveProficiency2024ChoiceArray(background.proficiency_choices)
  }

  @FieldResolver(() => [BackgroundEquipmentChoice2024], { nullable: true })
  async equipment_options(
    @Root() background: Background2024
  ): Promise<BackgroundEquipmentChoice2024[]> {
    return resolveBackgroundEquipmentChoices(background.equipment_options)
  }
}
