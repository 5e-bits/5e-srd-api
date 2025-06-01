import { Arg, Args, FieldResolver, Query, Resolver, Root } from 'type-graphql'

import { buildSortPipeline } from '@/graphql/2014/common/args'
import {
  AbilityScoreBonusChoice,
  AbilityScoreBonusChoiceOption,
  LanguageChoice,
  ProficiencyChoice} from '@/graphql/2014/common/choiceTypes'
import { buildMongoQueryFromNumberFilter } from '@/graphql/2014/common/inputs'
import {
  resolveLanguageChoice,
  resolveMultipleReferences,
  resolveProficiencyChoice,
  resolveSingleReference} from '@/graphql/2014/utils/resolvers'
import AbilityScoreModel, { AbilityScore } from '@/models/2014/abilityScore'
import { AbilityBonusOption,Choice, OptionsArrayOptionSet } from '@/models/2014/common/choice'
import LanguageModel, { Language } from '@/models/2014/language'
import ProficiencyModel, { Proficiency } from '@/models/2014/proficiency'
import RaceModel, { Race, RaceAbilityBonus } from '@/models/2014/race'
import SubraceModel, { Subrace } from '@/models/2014/subrace'
import TraitModel, { Trait } from '@/models/2014/trait'
import { escapeRegExp } from '@/util'

import {
  RACE_SORT_FIELD_MAP,
  RaceArgs,
  RaceArgsSchema,
  RaceIndexArgsSchema,
  RaceOrderField} from './args'

@Resolver(() => Race)
export class RaceResolver {
  @Query(() => [Race], { description: 'Gets all races, optionally filtered by name and sorted.' })
  async races(@Args(() => RaceArgs) args: RaceArgs): Promise<Race[]> {
    const validatedArgs = RaceArgsSchema.parse(args)

    const query = RaceModel.find()
    const filters: any[] = []

    if (validatedArgs.name) {
      filters.push({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    if (validatedArgs.ability_bonus?.length) {
      filters.push({ 'ability_bonuses.ability_score.index': { $in: validatedArgs.ability_bonus } })
    }

    if (validatedArgs.size?.length) {
      filters.push({ size: { $in: validatedArgs.size } })
    }

    if (validatedArgs.language?.length) {
      filters.push({ 'languages.index': { $in: validatedArgs.language } })
    }

    if (validatedArgs.speed) {
      const speedQuery = buildMongoQueryFromNumberFilter(validatedArgs.speed)
      if (speedQuery) {
        filters.push({ speed: speedQuery })
      }
    }

    if (filters.length > 0) {
      query.where({ $and: filters })
    }

    const sortQuery = buildSortPipeline<RaceOrderField>({
      order: validatedArgs.order,
      sortFieldMap: RACE_SORT_FIELD_MAP,
      defaultSortField: RaceOrderField.NAME
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

  @Query(() => Race, { nullable: true, description: 'Gets a single race by its index.' })
  async race(@Arg('index', () => String) indexInput: string): Promise<Race | null> {
    const { index } = RaceIndexArgsSchema.parse({ index: indexInput })
    return RaceModel.findOne({ index }).lean()
  }

  @FieldResolver(() => [Language], { nullable: true })
  async languages(@Root() race: Race): Promise<Language[]> {
    return resolveMultipleReferences(race.languages, LanguageModel)
  }

  @FieldResolver(() => [Proficiency], { nullable: true })
  async starting_proficiencies(@Root() race: Race): Promise<Proficiency[]> {
    return resolveMultipleReferences(race.starting_proficiencies, ProficiencyModel)
  }

  @FieldResolver(() => [Subrace], { nullable: true })
  async subraces(@Root() race: Race): Promise<Subrace[]> {
    return resolveMultipleReferences(race.subraces, SubraceModel)
  }

  @FieldResolver(() => [Trait], { nullable: true })
  async traits(@Root() race: Race): Promise<Trait[]> {
    return resolveMultipleReferences(race.traits, TraitModel)
  }

  @FieldResolver(() => LanguageChoice, { nullable: true })
  async language_options(@Root() race: Race): Promise<LanguageChoice | null> {
    return resolveLanguageChoice(race.language_options as Choice)
  }

  @FieldResolver(() => ProficiencyChoice, { nullable: true })
  async starting_proficiency_options(@Root() race: Race): Promise<ProficiencyChoice | null> {
    return resolveProficiencyChoice(race.starting_proficiency_options)
  }

  @FieldResolver(() => AbilityScoreBonusChoice, { nullable: true })
  async ability_bonus_options(@Root() race: Race): Promise<AbilityScoreBonusChoice | null> {
    return resolveAbilityScoreBonusChoice(race.ability_bonus_options, AbilityScoreModel)
  }
}

@Resolver(RaceAbilityBonus)
export class RaceAbilityBonusResolver {
  @FieldResolver(() => AbilityScore, { nullable: true })
  async ability_score(@Root() raceAbilityBonus: RaceAbilityBonus): Promise<AbilityScore | null> {
    return resolveSingleReference(raceAbilityBonus.ability_score, AbilityScoreModel)
  }
}

async function resolveAbilityScoreBonusChoice(
  choiceData: Choice | undefined,
  TargetAbilityScoreModel: typeof AbilityScoreModel
): Promise<AbilityScoreBonusChoice | null> {
  if (!choiceData || !choiceData.type || typeof choiceData.choose !== 'number') {
    return null
  }

  const resolvedOptions: AbilityScoreBonusChoiceOption[] = []
  const from = choiceData.from as OptionsArrayOptionSet

  for (const option of from.options) {
    if (option.option_type === 'ability_bonus') {
      const abilityScore = await resolveSingleReference(
        (option as AbilityBonusOption).ability_score,
        TargetAbilityScoreModel
      )

      if (abilityScore) {
        resolvedOptions.push({
          option_type: option.option_type,
          ability_score: abilityScore as AbilityScore,
          bonus: (option as AbilityBonusOption).bonus
        })
      }
    }
  }

  if (resolvedOptions.length === 0 && from.options.length > 0) {
    return null
  }

  return {
    choose: choiceData.choose,
    type: choiceData.type,
    from: {
      option_set_type: from.option_set_type,
      options: resolvedOptions
    },
    desc: choiceData.desc
  }
}
