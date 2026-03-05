import { Arg, Args, FieldResolver, Query, Resolver, Root } from 'type-graphql'

import { Proficiency2024Choice } from '@/graphql/2024/common/choiceTypes'
import { BackgroundEquipmentChoice2024 } from '@/graphql/2024/types/backgroundEquipment'
import { resolveBackgroundEquipmentChoices } from '@/graphql/2024/utils/backgroundEquipmentResolver'
import { resolveProficiency2024ChoiceArray } from '@/graphql/2024/utils/choiceResolvers'
import { buildSortPipeline } from '@/graphql/common/args'
import { resolveMultipleReferences, resolveSingleReference } from '@/graphql/utils/resolvers'
import AbilityScoreModel, { AbilityScore2024 } from '@/models/2024/abilityScore'
import BackgroundModel, { Background2024, BackgroundFeatReference } from '@/models/2024/background'
import FeatModel, { Feat2024 } from '@/models/2024/feat'
import ProficiencyModel, { Proficiency2024 } from '@/models/2024/proficiency'
import { escapeRegExp } from '@/util'

import {
  BACKGROUND_SORT_FIELD_MAP,
  BackgroundArgs,
  BackgroundArgsSchema,
  BackgroundIndexArgsSchema,
  BackgroundOrderField
} from './args'

@Resolver(Background2024)
export class BackgroundResolver {
  @Query(() => [Background2024], {
    description: 'Gets all backgrounds, optionally filtered by name.'
  })
  async backgrounds(@Args(() => BackgroundArgs) args: BackgroundArgs): Promise<Background2024[]> {
    const validatedArgs = BackgroundArgsSchema.parse(args)

    const query = BackgroundModel.find()

    if (validatedArgs.name != null && validatedArgs.name !== '') {
      query.where({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    const sortQuery = buildSortPipeline<BackgroundOrderField>({
      order: validatedArgs.order,
      sortFieldMap: BACKGROUND_SORT_FIELD_MAP,
      defaultSortField: BackgroundOrderField.NAME
    })

    if (Object.keys(sortQuery).length > 0) {
      query.sort(sortQuery)
    }

    if (validatedArgs.skip !== undefined) {
      query.skip(validatedArgs.skip)
    }
    if (validatedArgs.limit !== undefined) {
      query.limit(validatedArgs.limit)
    }

    return query.lean()
  }

  @Query(() => Background2024, { nullable: true, description: 'Gets a single background by index.' })
  async background(
    @Arg('index', () => String) indexInput: string
  ): Promise<Background2024 | null> {
    const { index } = BackgroundIndexArgsSchema.parse({ index: indexInput })
    return BackgroundModel.findOne({ index }).lean()
  }

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
  async proficiency_choices(
    @Root() background: Background2024
  ): Promise<Proficiency2024Choice[]> {
    return resolveProficiency2024ChoiceArray(background.proficiency_choices)
  }

  @FieldResolver(() => [BackgroundEquipmentChoice2024], { nullable: true })
  async equipment_options(
    @Root() background: Background2024
  ): Promise<BackgroundEquipmentChoice2024[]> {
    return resolveBackgroundEquipmentChoices(background.equipment_options)
  }
}
