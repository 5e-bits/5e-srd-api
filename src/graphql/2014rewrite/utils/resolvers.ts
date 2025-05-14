import { APIReference } from '@/models/2014/types/apiReference'
import { ReturnModelType } from '@typegoose/typegoose'
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types'
import { Choice, OptionsArrayOptionSet, StringOption } from '@/models/2014/common'
import {
  StringChoice,
  StringChoiceOption,
  StringChoiceOptionSet
} from '@/graphql/2014rewrite/common/types'

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
