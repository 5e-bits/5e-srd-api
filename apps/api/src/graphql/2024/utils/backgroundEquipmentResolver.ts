import EquipmentModel from '@/models/2024/equipment'
import EquipmentCategoryModel, { EquipmentCategory2024 } from '@/models/2024/equipmentCategory'
import {
  Choice,
  ChoiceOption,
  CountedReferenceOption,
  EquipmentCategoryOptionSet,
  MoneyOption,
  MultipleOption,
  OptionsArrayOptionSet
} from '@/models/common/choice'

import { BackgroundEquipmentChoice2024 } from '../types/backgroundEquipment/choice'
import {
  ChoiceItemOption2024,
  CountedReferenceOption2024,
  EquipmentCategoryChoice2024,
  EquipmentCategorySet2024,
  MoneyOption2024,
  MultipleItemsOption2024
} from '../types/backgroundEquipment/common'
import { EquipmentOptionSet2024 } from '../types/backgroundEquipment/optionSet'

// --- Main entry point ---

export async function resolveBackgroundEquipmentChoices(
  choices: Choice[] | undefined
): Promise<BackgroundEquipmentChoice2024[]> {
  if (!choices) return []

  const resolved: BackgroundEquipmentChoice2024[] = []
  for (const choice of choices) {
    const resolvedChoice = await resolveBackgroundEquipmentChoice(choice)
    if (resolvedChoice) resolved.push(resolvedChoice)
  }
  return resolved
}

// --- Single choice ---

async function resolveBackgroundEquipmentChoice(
  choice: Choice
): Promise<BackgroundEquipmentChoice2024 | null> {
  const resolvedFrom = await resolveEquipmentOptionSet(choice.from as OptionsArrayOptionSet)
  if (!resolvedFrom) return null

  return {
    desc: choice.desc,
    choose: choice.choose,
    type: choice.type,
    from: resolvedFrom
  }
}

// --- Option set ---

async function resolveEquipmentOptionSet(
  optionSet: OptionsArrayOptionSet
): Promise<EquipmentOptionSet2024 | null> {
  const resolvedOptions: Array<
    CountedReferenceOption2024 | MultipleItemsOption2024 | MoneyOption2024
  > = []

  for (const option of optionSet.options) {
    const resolved = await resolveEquipmentOptionUnion(
      option as CountedReferenceOption | MultipleOption | MoneyOption
    )
    if (resolved) resolvedOptions.push(resolved)
  }

  return {
    option_set_type: optionSet.option_set_type,
    options: resolvedOptions
  }
}

// --- Top-level option union ---

async function resolveEquipmentOptionUnion(
  option: CountedReferenceOption | MultipleOption | MoneyOption
): Promise<CountedReferenceOption2024 | MultipleItemsOption2024 | MoneyOption2024 | null> {
  switch (option.option_type) {
    case 'counted_reference':
      return resolveCountedReferenceOption(option as CountedReferenceOption)
    case 'multiple':
      return resolveMultipleItemsOption(option as MultipleOption)
    case 'money':
      return resolveMoneyOption(option as MoneyOption)
    default:
      console.warn(`Unknown top-level option_type: ${option.option_type}`)
      return null
  }
}

// --- Counted reference ---

async function resolveCountedReferenceOption(
  option: CountedReferenceOption
): Promise<CountedReferenceOption2024 | null> {
  if (!option.of?.index) return null

  const equipment = await EquipmentModel.findOne({ index: option.of.index }).lean()
  if (!equipment) return null

  return {
    option_type: option.option_type,
    count: option.count,
    of: equipment
  } as CountedReferenceOption2024
}

// --- Multiple items ---

async function resolveMultipleItemsOption(
  option: MultipleOption
): Promise<MultipleItemsOption2024 | null> {
  if (!option.items?.length) return null

  const resolvedItems: Array<CountedReferenceOption2024 | MoneyOption2024 | ChoiceItemOption2024> =
    []

  for (const item of option.items) {
    let resolved: CountedReferenceOption2024 | MoneyOption2024 | ChoiceItemOption2024 | null = null

    if (item.option_type === 'counted_reference') {
      resolved = await resolveCountedReferenceOption(item as CountedReferenceOption)
    } else if (item.option_type === 'money') {
      resolved = resolveMoneyOption(item as MoneyOption)
    } else if (item.option_type === 'choice') {
      resolved = await resolveChoiceItemOption(item as ChoiceOption)
    } else {
      console.warn(`Unknown option_type within MultipleOption items: ${item.option_type}`)
    }

    if (resolved) resolvedItems.push(resolved)
  }

  return {
    option_type: option.option_type,
    items: resolvedItems
  }
}

// --- Choice item (equipment category) ---

async function resolveChoiceItemOption(option: ChoiceOption): Promise<ChoiceItemOption2024 | null> {
  const nestedChoice = option.choice
  const nestedFrom = nestedChoice.from as EquipmentCategoryOptionSet

  if (
    nestedFrom.option_set_type !== 'equipment_category' ||
    !nestedFrom.equipment_category?.index
  ) {
    console.warn('ChoiceOption.choice.from is not a valid EquipmentCategoryOptionSet:', nestedFrom)
    return null
  }

  const equipmentCategory = await EquipmentCategoryModel.findOne({
    index: nestedFrom.equipment_category.index
  }).lean()

  if (!equipmentCategory) {
    console.warn(`Equipment category not found: ${nestedFrom.equipment_category.index}`)
    return null
  }

  const categorySet: EquipmentCategorySet2024 = {
    option_set_type: nestedFrom.option_set_type,
    equipment_category: equipmentCategory as EquipmentCategory2024
  }

  const equipmentCategoryChoice: EquipmentCategoryChoice2024 = {
    choose: nestedChoice.choose,
    type: nestedChoice.type,
    from: categorySet
  }

  return {
    option_type: option.option_type,
    choice: equipmentCategoryChoice
  }
}

// --- Money ---

function resolveMoneyOption(option: MoneyOption): MoneyOption2024 {
  return {
    option_type: option.option_type,
    count: option.count,
    unit: option.unit
  }
}
