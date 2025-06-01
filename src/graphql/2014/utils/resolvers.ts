import { ReturnModelType } from '@typegoose/typegoose'
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types'

import {
  LanguageChoice,
  LanguageChoiceOption,
  LanguageChoiceOptionSet,
  ProficiencyChoice,
  ProficiencyChoiceOption,
  ProficiencyChoiceOptionSet,
  StringChoice,
  StringChoiceOption,
  StringChoiceOptionSet} from '@/graphql/2014/common/choiceTypes'
import { APIReference } from '@/models/2014/common/apiReference'
import {
  Choice,
  ChoiceOption,
  OptionsArrayOptionSet,
  ReferenceOption,
  StringOption} from '@/models/2014/common/choice'
import LanguageModel, { Language } from '@/models/2014/language'
import ProficiencyModel, { Proficiency } from '@/models/2014/proficiency'

export async function resolveSingleReference<T>(
  reference: APIReference | null | undefined,
  TargetModel: ReturnModelType<AnyParamConstructor<T>>
): Promise<any | null> {
  if (!reference?.index) {
    return null
  }
  return TargetModel.findOne({ index: reference.index }).lean() as any
}

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

export async function resolveReferenceOptionArray<
  TItem,
  TGqlItemChoiceOption extends { option_type: string; item: TItem }
>(
  optionsArraySet: OptionsArrayOptionSet,
  ItemModel: ReturnModelType<AnyParamConstructor<TItem>>,
  createGqlOption: (item: TItem, optionType: string) => TGqlItemChoiceOption
): Promise<TGqlItemChoiceOption[]> {
  const resolvedEmbeddedOptions: TGqlItemChoiceOption[] = []
  for (const dbOption of optionsArraySet.options) {
    const dbRefOpt = dbOption as ReferenceOption
    const resolvedItem = await resolveSingleReference(dbRefOpt.item, ItemModel)
    if (resolvedItem) {
      resolvedEmbeddedOptions.push(createGqlOption(resolvedItem as TItem, dbRefOpt.option_type))
    }
  }
  return resolvedEmbeddedOptions
}

export function resolveStringChoice(choiceData: Choice): StringChoice {
  const dbOptionSet = choiceData.from as OptionsArrayOptionSet

  const gqlChoiceOptions: StringChoiceOption[] = []
  for (const dbOption of dbOptionSet.options) {
    const dbStringOpt = dbOption as StringOption
    gqlChoiceOptions.push({
      string: dbStringOpt.string,
      option_type: dbStringOpt.option_type || 'string' // Fallback for option_type
    })
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
    const resolvedOptions = await resolveReferenceOptionArray(
      optionsArraySet,
      LanguageModel,
      (item, optionType) => ({ option_type: optionType, item }) as LanguageChoiceOption
    )
    gqlEmbeddedOptions.push(...resolvedOptions)
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
