import { ReturnModelType } from '@typegoose/typegoose'
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types'

import {
  StringChoice,
  StringChoiceOption,
  StringChoiceOptionSet
} from '@/graphql/common/choiceTypes'
import { APIReference } from '@/models/common/apiReference'
import {
  Choice,
  OptionsArrayOptionSet,
  ReferenceOption,
  StringOption
} from '@/models/common/choice'

export async function resolveSingleReference<T>(
  reference: APIReference | null | undefined,
  TargetModel: ReturnModelType<AnyParamConstructor<T>>
): Promise<any | null> {
  if (reference == null || reference.index == null || reference.index === '') {
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
    if (resolvedItem !== null) {
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
