import {
  Proficiency2024Choice,
  Proficiency2024ChoiceOption,
  Proficiency2024ChoiceOptionSet,
  ScorePrerequisiteChoice2024,
  ScorePrerequisiteOption2024,
  ScorePrerequisiteOptionSet2024
} from '@/graphql/2024/common/choiceTypes'
import { resolveSingleReference } from '@/graphql/utils/resolvers'
import AbilityScoreModel, { AbilityScore2024 } from '@/models/2024/abilityScore'
import ProficiencyModel, { Proficiency2024 } from '@/models/2024/proficiency'
import {
  Choice,
  OptionsArrayOptionSet,
  ReferenceOption,
  ScorePrerequisiteOption
} from '@/models/common/choice'

export async function resolveScorePrerequisiteChoice(
  choiceData: Choice | undefined
): Promise<ScorePrerequisiteChoice2024 | null> {
  if (!choiceData) return null

  const optionsArraySet = choiceData.from as OptionsArrayOptionSet
  const resolvedOptions: ScorePrerequisiteOption2024[] = []

  for (const dbOption of optionsArraySet.options) {
    const dbScoreOpt = dbOption as ScorePrerequisiteOption
    const abilityScore = await resolveSingleReference(dbScoreOpt.ability_score, AbilityScoreModel)
    if (abilityScore !== null) {
      resolvedOptions.push({
        option_type: dbScoreOpt.option_type,
        ability_score: abilityScore as AbilityScore2024,
        minimum_score: dbScoreOpt.minimum_score
      })
    }
  }

  return {
    desc: choiceData.desc,
    choose: choiceData.choose,
    type: choiceData.type,
    from: {
      option_set_type: optionsArraySet.option_set_type,
      options: resolvedOptions
    } as ScorePrerequisiteOptionSet2024
  }
}

export async function resolveProficiency2024Choice(
  choiceData: Choice | undefined
): Promise<Proficiency2024Choice | null> {
  if (!choiceData) return null

  const optionsArraySet = choiceData.from as OptionsArrayOptionSet
  const resolvedOptions: Proficiency2024ChoiceOption[] = []

  for (const dbOption of optionsArraySet.options) {
    const dbRefOpt = dbOption as ReferenceOption
    const proficiency = await resolveSingleReference(dbRefOpt.item, ProficiencyModel)
    if (proficiency !== null) {
      resolvedOptions.push({
        option_type: dbRefOpt.option_type,
        item: proficiency as Proficiency2024
      })
    }
  }

  return {
    desc: choiceData.desc,
    choose: choiceData.choose,
    type: choiceData.type,
    from: {
      option_set_type: optionsArraySet.option_set_type,
      options: resolvedOptions
    } as Proficiency2024ChoiceOptionSet
  }
}

export async function resolveProficiency2024ChoiceArray(
  choices: Choice[] | undefined
): Promise<Proficiency2024Choice[]> {
  if (!choices || !Array.isArray(choices)) return []

  const resolved: Proficiency2024Choice[] = []
  for (const choice of choices) {
    const resolvedChoice = await resolveProficiency2024Choice(choice)
    if (resolvedChoice) resolved.push(resolvedChoice)
  }
  return resolved
}
