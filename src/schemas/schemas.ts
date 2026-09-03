import { z } from 'zod'

// --- Helper Functions ---

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

/**
 * Shared helper to parse comma-separated string/array query params.
 * Trims whitespace, removes empty tokens, and returns undefined if empty.
 */
const splitCommaList = (val: string | string[] | undefined): string[] | undefined => {
  if (val == null || val === '' || (Array.isArray(val) && val.length === 0)) return undefined
  const out = (Array.isArray(val) ? val : [val]).flatMap((s) => s.split(',')).map((s) => s.trim()).filter(Boolean)
  return out.length > 0 ? out : undefined
}

/**
 * Shared transform for numeric list query params that accept comma-separated values.
 * Handles single strings, arrays, and comma-separated strings (e.g. "1,2" or "1%2C2").
 * Non-numeric tokens are silently dropped.
 */
const transformNumericList = (val: string | string[] | undefined) => {
  const numbers = splitCommaList(val)?.map(Number).filter((n) => !isNaN(n))
  return numbers && numbers.length > 0 ? numbers : undefined
}

/**
 * Shared transform for string list query params that accept comma-separated values.
 * Handles single strings, arrays, and comma-separated strings (e.g. "illusion,evocation").
 */
const transformStringList = (val: string | string[] | undefined) => {
   return splitCommaList(val);
}

// Schemas from api/2014/spellController.ts
export const SpellIndexQuerySchema = NameQuerySchema.extend({
  level: z.string().or(z.string().array()).optional().transform(transformNumericList),
  school: z.string().or(z.array(z.string())).optional().transform(transformStringList)
})

// Schemas from api/2014/classController.ts
export const ClassLevelsQuerySchema = z.object({
  subclass: z.string().min(1).optional()
})

// Schemas from api/2014/monsterController.ts
const transformChallengeRating = transformNumericList

export const MonsterIndexQuerySchema = NameQuerySchema.extend({
  challenge_rating: z.string().or(z.string().array()).optional().transform(transformChallengeRating)
})
