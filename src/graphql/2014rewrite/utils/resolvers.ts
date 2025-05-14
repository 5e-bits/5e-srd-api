import { APIReference } from '@/models/2014/types/apiReference'
import { ReturnModelType } from '@typegoose/typegoose'
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types'
import {
  Choice,
  OptionsArrayOptionSet,
  StringOption,
  ReferenceOption,
  ScorePrerequisiteOption,
  ChoiceOption,
  AbilityBonusOption,
  BreathOption,
  DamageOption,
  ActionOption
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
  PrerequisiteChoiceOption,
  AbilityScoreBonusChoice,
  AbilityScoreBonusChoiceOption
} from '@/graphql/2014rewrite/common/choiceTypes'
import {
  BreathChoice,
  BreathChoiceOption,
  DamageChoice,
  DamageChoiceOption,
  ActionChoice,
  ActionChoiceOption,
  MultipleActionChoiceOption
} from '@/graphql/2014rewrite/types/monsterTypes'
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
import AbilityScoreModel, { AbilityScore } from '@/models/2014/abilityScore'
import DamageTypeModel, { DamageType } from '@/models/2014/damageType'
import { Damage } from '@/models/2014/common'

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

export async function resolveAbilityScoreBonusChoice(
  choiceData: Choice | undefined,
  abilityScoreModel: ReturnModelType<AnyParamConstructor<AbilityScore>>
): Promise<AbilityScoreBonusChoice | null> {
  if (!choiceData || !choiceData.type || typeof choiceData.choose !== 'number') {
    return null
  }

  const options: AbilityScoreBonusChoiceOption[] = []
  const from = choiceData.from as OptionsArrayOptionSet

  for (const option of from.options) {
    if (option.option_type === 'ability_bonus') {
      const abilityScore = await resolveSingleReference(
        (option as AbilityBonusOption).ability_score,
        abilityScoreModel
      )

      options.push({
        option_type: option.option_type,
        ability_score: abilityScore,
        bonus: (option as AbilityBonusOption).bonus
      })
    }
  }

  return {
    choose: choiceData.choose,
    type: choiceData.type,
    from: {
      option_set_type: from.option_set_type,
      options
    },
    desc: choiceData.desc
  }
}

export const resolveBreathChoice = async (
  choiceData: Choice | undefined | null
): Promise<BreathChoice | null> => {
  if (!choiceData || !('options' in choiceData.from)) {
    return null
  }

  const options = (choiceData.from as OptionsArrayOptionSet).options
  const validOptions: BreathChoiceOption[] = []

  for (const option of options) {
    if (option.option_type === 'breath') {
      const breathOption = option as BreathOption
      const abilityScore = await resolveSingleReference(breathOption.dc.dc_type, AbilityScoreModel)

      const resolvedOption: BreathChoiceOption = {
        option_type: breathOption.option_type,
        name: breathOption.name,
        dc: {
          dc_type: abilityScore,
          dc_value: breathOption.dc.dc_value,
          success_type: breathOption.dc.success_type
        }
      }

      if (breathOption.damage) {
        // Resolve each damage entry directly
        const resolvedDamage = await Promise.all(
          breathOption.damage.map(async (d) => {
            const newDamage: { damage_dice: string; damage_type?: DamageType } = {
              damage_dice: d.damage_dice
            }

            const damageType = await resolveSingleReference(d.damage_type, DamageTypeModel)
            if (damageType) {
              newDamage.damage_type = damageType
            }

            return newDamage
          })
        )

        // Only include entries with a valid damage_type
        resolvedOption.damage = resolvedDamage.filter(
          (d) => d.damage_type !== undefined
        ) as Damage[]
      }

      validOptions.push(resolvedOption)
    }
  }

  if (validOptions.length === 0) {
    return null
  }

  return {
    choose: choiceData.choose,
    type: choiceData.type,
    from: {
      option_set_type: choiceData.from.option_set_type,
      options: validOptions
    },
    desc: choiceData.desc
  }
}

export const resolveDamageChoice = async (choiceData: Choice): Promise<DamageChoice | null> => {
  if (!('options' in choiceData.from)) {
    return null
  }

  const options = (choiceData.from as OptionsArrayOptionSet).options
  const validOptions: DamageChoiceOption[] = []

  for (const option of options) {
    if (option.option_type === 'damage') {
      const damageOption = option as DamageOption
      const resolvedOption: DamageChoiceOption = {
        option_type: damageOption.option_type,
        damage: {
          damage_dice: damageOption.damage_dice,
          damage_type: await resolveSingleReference(damageOption.damage_type, DamageTypeModel)
        }
      }

      validOptions.push(resolvedOption)
    }
  }

  if (validOptions.length === 0) {
    return null
  }

  return {
    choose: choiceData.choose,
    type: choiceData.type,
    from: {
      option_set_type: choiceData.from.option_set_type,
      options: validOptions
    },
    desc: choiceData.desc
  }
}

export const resolveActionChoice = async (
  choiceData: Choice | undefined | null
): Promise<ActionChoice | null> => {
  if (!choiceData || !('options' in choiceData.from)) {
    return null
  }

  const options = (choiceData.from as OptionsArrayOptionSet).options
  const validOptions: Array<ActionChoiceOption | MultipleActionChoiceOption> = []

  for (const option of options) {
    if (option.option_type === 'multiple') {
      // Handle multiple type with nested items
      const multipleOption = option as { option_type: string; items: ActionOption[] }
      const resolvedItems = multipleOption.items.map((item) => ({
        option_type: item.option_type,
        action_name: item.action_name,
        count: typeof item.count === 'string' ? parseInt(item.count) : item.count,
        type: item.type
      }))

      validOptions.push({
        option_type: multipleOption.option_type,
        items: resolvedItems
      })
    } else if (option.option_type === 'action') {
      // Handle single action option
      const actionOption = option as ActionOption
      const resolvedOption: ActionChoiceOption = {
        option_type: actionOption.option_type,
        action_name: actionOption.action_name,
        count:
          typeof actionOption.count === 'string'
            ? parseInt(actionOption.count)
            : actionOption.count,
        type: actionOption.type
      }

      validOptions.push(resolvedOption)
    }
  }

  if (validOptions.length === 0) {
    return null
  }

  return {
    choose: choiceData.choose,
    type: choiceData.type,
    from: {
      option_set_type: choiceData.from.option_set_type,
      options: validOptions
    },
    desc: choiceData.desc
  }
}
