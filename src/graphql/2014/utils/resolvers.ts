import {
  LanguageChoice,
  LanguageChoiceOption,
  LanguageChoiceOptionSet,
  ProficiencyChoice,
  ProficiencyChoiceOption,
  ProficiencyChoiceOptionSet
} from '@/graphql/2014/common/choiceTypes'
import { resolveSingleReference, resolveReferenceOptionArray } from '@/graphql/utils/resolvers'
import LanguageModel, { Language } from '@/models/2014/language'
import ProficiencyModel, { Proficiency } from '@/models/2014/proficiency'
import {
  Choice,
  ChoiceOption,
  OptionsArrayOptionSet,
  ReferenceOption
} from '@/models/common/choice'

export async function resolveLanguageChoice(
  choiceData: Choice | null
): Promise<LanguageChoice | null> {
  const gqlEmbeddedOptions: LanguageChoiceOption[] = []

  if (!choiceData) {
    return null
  }

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
      if (resolvedItem !== null) {
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
