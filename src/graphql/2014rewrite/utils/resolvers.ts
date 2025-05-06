import { APIReference } from '@/models/2014/types/apiReference'
import { ReturnModelType } from '@typegoose/typegoose'
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types'

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
