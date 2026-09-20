import { FieldResolver, Resolver, Root } from 'type-graphql'

import {
  AbilityScoreBonusChoice,
  AbilityScoreBonusChoiceOption,
  LanguageChoice
} from '@/graphql/2014/common/choiceTypes'
import { resolveLanguageChoice } from '@/graphql/2014/utils/resolvers'
import { createResolver } from '@/graphql/common/createResolver'
import { inFilter, numberFilter, regexFilter } from '@/graphql/common/filters'
import { resolveMultipleReferences, resolveSingleReference } from '@/graphql/utils/resolvers'
import AbilityScoreModel, { AbilityScore } from '@/models/2014/abilityScore'
import LanguageModel, { Language } from '@/models/2014/language'
import RaceModel, { Race, RaceAbilityBonus } from '@/models/2014/race'
import SubraceModel, { Subrace } from '@/models/2014/subrace'
import TraitModel, { Trait } from '@/models/2014/trait'
import { AbilityBonusOption, Choice, OptionsArrayOptionSet } from '@/models/common/choice'

import { RaceArgs, RaceArgsSchema } from './args'

@Resolver(Race)
export class RaceResolver extends createResolver({
  Type: Race,
  Model: RaceModel,
  typeName: 'Race',
  singular: 'race',
  plural: 'races',
  descriptions: {
    fields: 'Fields to sort Races by',
    order: 'Specify sorting order for races. Allows nested sorting.',
    list: 'Gets all races, optionally filtered by name and sorted.',
    single: 'Gets a single race by its index.'
  },
  orderFields: {
    NAME: { value: 'name', path: 'name' }
  },
  defaultSort: 'NAME',
  Args: RaceArgs,
  argsSchema: RaceArgsSchema,
  filters: (a) => [
    regexFilter('name', a.name),
    inFilter('ability_bonuses.ability_score.index', a.ability_bonus),
    inFilter('size', a.size),
    inFilter('languages.index', a.language),
    numberFilter('speed', a.speed)
  ]
}) {
  @FieldResolver(() => [Language], { nullable: true })
  async languages(@Root() race: Race): Promise<Language[]> {
    return resolveMultipleReferences(race.languages, LanguageModel)
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

      if (abilityScore !== null) {
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
