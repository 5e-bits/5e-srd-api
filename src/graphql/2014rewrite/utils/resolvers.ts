import { APIReference } from '@/models/2014/types/apiReference'
import { ReturnModelType } from '@typegoose/typegoose'
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types'
import { Choice, OptionsArrayOptionSet, StringOption, ReferenceOption } from '@/models/2014/common'
import {
  StringChoice,
  StringChoiceOption,
  StringChoiceOptionSet,
  LanguageChoice,
  LanguageChoiceOptionSet,
  LanguageChoiceOption
} from '@/graphql/2014rewrite/common/types'
import LanguageModel, { Language } from '@/models/2014/language'
import TraitModel, { Trait } from '@/models/2014/trait'
import SpellModel, { Spell } from '@/models/2014/spell'
import {
  TraitChoice,
  TraitChoiceOptionSet,
  TraitChoiceOption,
  SpellChoice,
  SpellChoiceOptionSet,
  SpellChoiceOption
} from '@/graphql/2014rewrite/types/traitTypes'

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
  if (dbOptionSet.options && Array.isArray(dbOptionSet.options)) {
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
  if (!choiceData) {
    return null
  }

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
  if (!choiceData || !choiceData.from) {
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
  if (!choiceData || !choiceData.from) {
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
