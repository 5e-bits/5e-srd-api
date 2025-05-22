import {
  StartingEquipmentChoice,
  EquipmentCategorySet,
  EquipmentOptionSet,
  CountedReferenceOption as ResolvedCountedReferenceOption,
  EquipmentCategoryChoiceOption,
  MultipleItemsOption,
  ProficiencyPrerequisite as ResolvedProficiencyPrerequisite
} from '../types/startingEquipment'

import {
  Choice,
  OptionSet,
  EquipmentCategoryOptionSet,
  OptionsArrayOptionSet,
  CountedReferenceOption,
  ChoiceOption,
  MultipleOption
} from '@/models/2014/common/choice'

import EquipmentModel, { Equipment } from '@/models/2014/equipment'
import EquipmentCategoryModel, { EquipmentCategory } from '@/models/2014/equipmentCategory'
import ProficiencyModel, { Proficiency } from '@/models/2014/proficiency'

interface ProficiencyPrerequisite {
  type: string
  proficiency: { index: string; name: string; url: string }
}

// --- Main Resolver Function ---
export async function resolveStartingEquipmentChoices(
  choices: Choice[] | undefined | null
): Promise<StartingEquipmentChoice[]> {
  if (!choices) {
    return []
  }
  const resolvedChoices: StartingEquipmentChoice[] = []
  for (const choice of choices) {
    const resolvedChoice = await resolveStartingEquipmentChoice(choice)
    if (resolvedChoice) {
      resolvedChoices.push(resolvedChoice)
    }
  }
  return resolvedChoices
}

// --- Helper to map a single DB Choice to GraphQL StartingEquipmentChoice ---
async function resolveStartingEquipmentChoice(
  choice: Choice
): Promise<StartingEquipmentChoice | null> {
  const resolvedFrom = await resolveStartingEquipmentOptionSet(choice.from as OptionSet)
  if (!resolvedFrom) {
    return null
  }

  return {
    choose: choice.choose,
    desc: choice.desc,
    type: choice.type,
    from: resolvedFrom
  }
}

// Maps the 'from' part of a DB choice to either GQL EquipmentCategorySet or EquipmentOptionSet
async function resolveStartingEquipmentOptionSet(
  optionSet: OptionSet
): Promise<EquipmentCategorySet | EquipmentOptionSet | null> {
  if (optionSet.option_set_type === 'equipment_category') {
    const dbEcOS = optionSet as EquipmentCategoryOptionSet
    const category = await EquipmentCategoryModel.findOne({
      index: dbEcOS.equipment_category.index
    }).lean()
    if (!category) return null

    return {
      option_set_type: dbEcOS.option_set_type,
      equipment_category: category as EquipmentCategory
    } as EquipmentCategorySet
  } else if (optionSet.option_set_type === 'options_array') {
    const dbOaos = optionSet as OptionsArrayOptionSet
    return await resolveEquipmentOptionSet(dbOaos)
  }
  return null
}

async function resolveEquipmentOptionSet(
  dbOaos: OptionsArrayOptionSet
): Promise<EquipmentOptionSet | null> {
  const resolvedOptions: Array<
    ResolvedCountedReferenceOption | EquipmentCategoryChoiceOption | MultipleItemsOption
  > = []
  for (const dbOpt of dbOaos.options) {
    const resolvedOpt = await resolveEquipmentOptionUnion(
      dbOpt as CountedReferenceOption | ChoiceOption | MultipleOption
    )
    if (resolvedOpt) {
      resolvedOptions.push(resolvedOpt)
    }
  }

  return {
    option_set_type: dbOaos.option_set_type,
    options: resolvedOptions
  } as EquipmentOptionSet
}

async function resolveEquipmentOptionUnion(
  dbOption: CountedReferenceOption | ChoiceOption | MultipleOption
): Promise<
  ResolvedCountedReferenceOption | EquipmentCategoryChoiceOption | MultipleItemsOption | null
> {
  if (!dbOption.option_type) return null

  switch (dbOption.option_type) {
    case 'counted_reference':
      return resolveCountedReferenceOption(dbOption as CountedReferenceOption)
    case 'choice':
      return resolveEquipmentCategoryChoiceOption(dbOption as ChoiceOption)
    case 'multiple':
      return resolveMultipleItemsOption(dbOption as MultipleOption)
    default:
      console.warn(`Unknown dbOption.option_type: ${dbOption.option_type}`)
      return null
  }
}

async function resolveProficiencyPrerequisites(
  dbPrerequisites: ProficiencyPrerequisite[] | undefined
): Promise<ResolvedProficiencyPrerequisite[]> {
  if (!dbPrerequisites || dbPrerequisites.length === 0) {
    return []
  }
  const resolvedPrerequisites: ResolvedProficiencyPrerequisite[] = []
  for (const dbPrereq of dbPrerequisites) {
    const proficiency = await ProficiencyModel.findOne({ index: dbPrereq.proficiency.index }).lean()
    if (proficiency) {
      resolvedPrerequisites.push({
        type: dbPrereq.type,
        proficiency: proficiency as Proficiency
      })
    }
  }
  return resolvedPrerequisites
}

async function resolveCountedReferenceOption(
  countedReferenceOption: CountedReferenceOption
): Promise<ResolvedCountedReferenceOption | null> {
  if (!countedReferenceOption.of.index) return null

  const equipment = await EquipmentModel.findOne({ index: countedReferenceOption.of.index }).lean()
  if (!equipment) return null

  const resolvedPrerequisites = await resolveProficiencyPrerequisites(
    countedReferenceOption.prerequisites as ProficiencyPrerequisite[] | undefined
  )

  return {
    option_type: countedReferenceOption.option_type,
    count: countedReferenceOption.count,
    of: equipment as Equipment,
    prerequisites: resolvedPrerequisites.length > 0 ? resolvedPrerequisites : undefined
  } as ResolvedCountedReferenceOption
}

async function resolveEquipmentCategoryChoiceOption(
  choiceOption: ChoiceOption
): Promise<EquipmentCategoryChoiceOption | null> {
  const nestedChoice = choiceOption.choice
  const nestedFrom = nestedChoice.from as EquipmentCategoryOptionSet

  if (nestedFrom.option_set_type !== 'equipment_category' || !nestedFrom.equipment_category.index) {
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

  return {
    option_type: choiceOption.option_type,
    choice: {
      choose: nestedChoice.choose,
      desc: nestedChoice.desc,
      type: nestedChoice.type,
      from: {
        option_set_type: nestedFrom.option_set_type,
        equipment_category: equipmentCategory as EquipmentCategory
      } as EquipmentCategorySet
    }
  } as EquipmentCategoryChoiceOption
}

async function resolveMultipleItemsOption(
  multipleOption: MultipleOption
): Promise<MultipleItemsOption | null> {
  if (multipleOption.items.length === 0) {
    console.warn('Invalid MultipleOption data:', multipleOption)
    return null
  }

  const resolvedItems: Array<ResolvedCountedReferenceOption | EquipmentCategoryChoiceOption> = []

  for (const item of multipleOption.items) {
    if (!item.option_type) {
      console.warn('Invalid item within MultipleOption items array:', item)
      continue
    }

    let resolvedItem: ResolvedCountedReferenceOption | EquipmentCategoryChoiceOption | null = null

    if (item.option_type === 'counted_reference') {
      resolvedItem = await resolveCountedReferenceOption(item as CountedReferenceOption)
    } else if (item.option_type === 'choice') {
      resolvedItem = await resolveEquipmentCategoryChoiceOption(item as ChoiceOption)
    } else {
      console.warn(`Unknown option_type within MultipleOption items: ${item.option_type}`)
    }

    if (resolvedItem) {
      resolvedItems.push(resolvedItem)
    }
  }

  if (resolvedItems.length === 0 && multipleOption.items.length > 0) {
    console.warn('All items within MultipleOption failed to resolve:', multipleOption)
    return null
  }

  return {
    option_type: multipleOption.option_type,
    items: resolvedItems
  } as MultipleItemsOption
}
