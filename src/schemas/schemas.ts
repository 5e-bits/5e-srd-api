import { z } from 'zod'

// --- Helper Functions ---
/**
 * Zod transform helper to ensure the value is an array or undefined.
 * If the input is a single value, it's wrapped in an array.
 * If the input is already an array, it's returned as is.
 * If the input is nullish, undefined is returned.
 */
const ensureArrayOrUndefined = <T>(val: T | T[] | undefined): T[] | undefined => {
  if (val === undefined || val === null) {
    return undefined
  }
  if (Array.isArray(val)) {
    return val
  }
  return [val]
}

// --- Base Schemas ---
export const ShowParamsSchema = z.object({
  index: z.string().min(1)
})

export const NameQuerySchema = z.object({
  name: z.string().optional()
})

// --- Derived Generic Schemas ---
export const NameDescQuerySchema = NameQuerySchema.extend({
  desc: z.string().optional()
})

export const LevelParamsSchema = ShowParamsSchema.extend({
  level: z.coerce.number().int().min(1).max(20)
})

// --- Specific Controller Schemas ---

// Schemas from api/2014/spellController.ts
export const SpellIndexQuerySchema = NameQuerySchema.extend({
  level: z
    .string()
    .regex(/^\d+$/)
    .or(z.array(z.string().regex(/^\d+$/)))
    .optional()
    .transform(ensureArrayOrUndefined),
  school: z.string().or(z.array(z.string())).optional().transform(ensureArrayOrUndefined)
})

// Schemas from api/2014/classController.ts
export const ClassLevelsQuerySchema = z.object({
  subclass: z.string().min(1).optional()
})

// Schemas from api/2014/monsterController.ts
// --- Helper Transformation (for MonsterIndexQuerySchema) ---
const transformChallengeRating = (val: string | string[] | undefined) => {
  if (val == null || val === '' || (Array.isArray(val) && val.length === 0)) return undefined
  // Ensure it's an array, handling both single string and array inputs
  const arr = Array.isArray(val) ? val : [val]
  // Flatten in case of comma-separated strings inside the array, then split
  const flattened = arr.flatMap((item) => item.split(','))
  // Convert to numbers and filter out NaNs
  const numbers = flattened.map(Number).filter((item) => !isNaN(item))
  // Return undefined if no valid numbers result, otherwise return the array
  return numbers.length > 0 ? numbers : undefined
}

export const MonsterIndexQuerySchema = NameQuerySchema.extend({
  challenge_rating: z.string().or(z.string().array()).optional().transform(transformChallengeRating)
})
