import { APIReference } from '@/models/2014/types/apiReference'
import { ReturnModelType } from '@typegoose/typegoose'
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types'
import {
  Choice,
  OptionsArrayOptionSet,
  StringOption,
  ReferenceOption,
  ScorePrerequisiteOption,
  ChoiceOption
} from '@/models/2014/common'
import {
  StringChoice,
  StringChoiceOption,
  StringChoiceOptionSet,
  LanguageChoice,
  LanguageChoiceOptionSet,
  LanguageChoiceOption,
  ProficiencyChoice,
  ProficiencyChoiceOption,
  ProficiencyChoiceOptionSet,
  PrerequisiteChoice,
  PrerequisiteChoiceOption
} from '@/graphql/2014rewrite/common/choiceTypes'
import LanguageModel, { Language } from '@/models/2014/language'
import TraitModel, { Trait } from '@/models/2014/trait'
import SpellModel, { Spell } from '@/models/2014/spell'
import ProficiencyModel, { Proficiency } from '@/models/2014/proficiency'
import {
  TraitChoice,
  TraitChoiceOptionSet,
  TraitChoiceOption,
  SpellChoice,
  SpellChoiceOptionSet,
  SpellChoiceOption
} from '@/graphql/2014rewrite/types/traitTypes'
import AbilityScoreModel from '@/models/2014/abilityScore'

// Helper to resolve a single APIReference to a lean object
export async function resolveSingleReference<T>(
  reference: APIReference | null | undefined,
  TargetModel: ReturnModelType<AnyParamConstructor<T>>
): Promise<any | null> {
  if (!reference?.index) {
    return null
  }
  return TargetModel.findOne({ index: reference.index }).lean() as any
}

// Helper to resolve an array of APIReferences to an array of lean objects
export async function resolveMultipleReferences<T>(
  references: APIReference[] | null | undefined,
  TargetModel: ReturnModelType<AnyParamConstructor<T>>
): Promise<any[]> {
  if (!references || references.length === 0) {
    return []
  }

  const indices = references.map((ref) => ref.index)
  return TargetModel.find({ index: { $in: indices } }).lean() as any
}

export function resolveStringChoice(choiceData: Choice): StringChoice {
  const dbOptionSet = choiceData.from as OptionsArrayOptionSet

  const gqlChoiceOptions: StringChoiceOption[] = []
  if (Array.isArray(dbOptionSet.options)) {
    for (const dbOption of dbOptionSet.options) {
      const dbStringOpt = dbOption as StringOption
      gqlChoiceOptions.push({
        string: dbStringOpt.string,
        option_type: dbStringOpt.option_type || 'string' // Fallback for option_type
      })
    }
  }

  const gqlOptionSet: StringChoiceOptionSet = {
    option_set_type: dbOptionSet.option_set_type,
    options: gqlChoiceOptions
  }

  return {
    choose: choiceData.choose,
    type: choiceData.type,
    from: gqlOptionSet
  }
}

export async function resolveLanguageChoice(choiceData: Choice): Promise<LanguageChoice | null> {
  const gqlEmbeddedOptions: LanguageChoiceOption[] = []

  if (choiceData.from.option_set_type === 'resource_list') {
    const allItems = (await LanguageModel.find({}).lean()) as Language[]
    for (const item of allItems) {
      gqlEmbeddedOptions.push({
        option_type: 'reference',
        item: item
      })
    }
  } else if (choiceData.from.option_set_type === 'options_array') {
    const optionsArraySet = choiceData.from as OptionsArrayOptionSet
    for (const dbOption of optionsArraySet.options) {
      const dbRefOpt = dbOption as ReferenceOption
      const resolvedItem = await resolveSingleReference(dbRefOpt.item, LanguageModel)
      gqlEmbeddedOptions.push({
        option_type: dbRefOpt.option_type,
        item: resolvedItem as Language
      })
    }
  }

  const gqlOptionSet: LanguageChoiceOptionSet = {
    option_set_type: choiceData.from.option_set_type,
    options: gqlEmbeddedOptions
  }

  return {
    choose: choiceData.choose,
    type: choiceData.type,
    from: gqlOptionSet
  }
}

export async function resolveTraitChoice(
  choiceData: Choice | undefined | null
): Promise<TraitChoice | null> {
  if (!choiceData) {
    return null
  }

  const gqlEmbeddedOptions: TraitChoiceOption[] = []

  const optionsArraySet = choiceData.from as OptionsArrayOptionSet
  for (const dbOption of optionsArraySet.options) {
    const dbRefOpt = dbOption as ReferenceOption
    const resolvedItem = await resolveSingleReference(dbRefOpt.item, TraitModel)
    gqlEmbeddedOptions.push({
      option_type: dbRefOpt.option_type,
      item: resolvedItem as Trait
    })
  }

  const gqlOptionSet: TraitChoiceOptionSet = {
    option_set_type: choiceData.from.option_set_type,
    options: gqlEmbeddedOptions
  }

  return {
    choose: choiceData.choose,
    type: choiceData.type,
    from: gqlOptionSet
  }
}

export async function resolveSpellChoice(
  choiceData: Choice | undefined | null
): Promise<SpellChoice | null> {
  if (!choiceData) {
    return null
  }

  const gqlEmbeddedOptions: SpellChoiceOption[] = []

  const optionsArraySet = choiceData.from as OptionsArrayOptionSet
  for (const dbOption of optionsArraySet.options) {
    const dbRefOpt = dbOption as ReferenceOption
    const resolvedItem = await resolveSingleReference(dbRefOpt.item, SpellModel)
    gqlEmbeddedOptions.push({
      option_type: dbRefOpt.option_type,
      item: resolvedItem as Spell
    })
  }

  const gqlOptionSet: SpellChoiceOptionSet = {
    option_set_type: choiceData.from.option_set_type,
    options: gqlEmbeddedOptions
  }

  return {
    choose: choiceData.choose,
    type: choiceData.type,
    from: gqlOptionSet
  }
}

export async function resolveProficiencyChoice(
  choiceData: Choice | undefined | null
): Promise<ProficiencyChoice | null> {
  if (!choiceData || !choiceData.type) {
    return null
  }

  const gqlEmbeddedOptions: ProficiencyChoiceOption[] = []

  const optionsArraySet = choiceData.from as OptionsArrayOptionSet
  for (const dbOption of optionsArraySet.options) {
    if (dbOption.option_type === 'choice') {
      // For nested choices, use ChoiceOption
      const choiceOpt = dbOption as ChoiceOption
      const nestedChoice = await resolveProficiencyChoice(choiceOpt.choice)
      if (nestedChoice) {
        gqlEmbeddedOptions.push({
          option_type: choiceOpt.option_type,
          item: nestedChoice
        })
      }
    } else {
      // Handle regular proficiency reference
      const dbRefOpt = dbOption as ReferenceOption
      const resolvedItem = await resolveSingleReference(dbRefOpt.item, ProficiencyModel)
      if (resolvedItem) {
        gqlEmbeddedOptions.push({
          option_type: dbRefOpt.option_type,
          item: resolvedItem as Proficiency
        })
      }
    }
  }

  const gqlOptionSet: ProficiencyChoiceOptionSet = {
    option_set_type: choiceData.from.option_set_type,
    options: gqlEmbeddedOptions
  }

  return {
    choose: choiceData.choose,
    type: choiceData.type,
    from: gqlOptionSet,
    desc: choiceData.desc
  }
}

export async function resolveProficiencyChoiceArray(
  choices: Choice[] | undefined | null
): Promise<ProficiencyChoice[]> {
  if (!choices || !Array.isArray(choices)) {
    return []
  }

  const resolvedChoices: ProficiencyChoice[] = []
  for (const choice of choices) {
    const resolvedChoice = await resolveProficiencyChoice(choice)
    if (resolvedChoice) {
      resolvedChoices.push(resolvedChoice)
    }
  }

  return resolvedChoices
}

export async function resolvePrerequisiteChoice(
  choiceData: Choice | undefined | null
): Promise<PrerequisiteChoice | null> {
  if (!choiceData || !choiceData.type || typeof choiceData.choose !== 'number') {
    return null
  }

  const gqlEmbeddedOptions: PrerequisiteChoiceOption[] = []

  const optionsArraySet = choiceData.from as OptionsArrayOptionSet
  for (const opt of optionsArraySet.options) {
    if (opt.option_type === 'score_prerequisite') {
      const scoreOpt = opt as ScorePrerequisiteOption
      const abilityScore = await resolveSingleReference(scoreOpt.ability_score, AbilityScoreModel)
      gqlEmbeddedOptions.push({
        option_type: scoreOpt.option_type,
        ability_score: abilityScore,
        minimum_score: scoreOpt.minimum_score
      })
    }
  }

  return {
    choose: choiceData.choose,
    type: choiceData.type,
    from: {
      option_set_type: choiceData.from.option_set_type,
      options: gqlEmbeddedOptions
    }
  }
}
