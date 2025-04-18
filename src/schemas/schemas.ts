import { z } from 'zod';

// Generic Schemas
export const ShowParamsSchema = z.object({
  index: z.string().min(1),
});

export const NameQuerySchema = z.object({
  name: z.string().optional(),
});

export const NameDescQuerySchema = z.object({
  name: z.string().optional(),
  desc: z.string().optional(),
});

export const LevelParamsSchema = z.object({
  index: z.string().min(1),
  level: z.coerce.number().int().min(1).max(20),
});

// Schemas from api/2014/spellController.ts
export const SpellIndexQuerySchema = z.object({
  name: z.string().optional(),
  level: z
    .union([z.string().regex(/^\d+$/), z.array(z.string().regex(/^\d+$/))])
    .optional()
    .transform((val) => (val ? (Array.isArray(val) ? val : [val]) : undefined)),
  school: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => (val ? (Array.isArray(val) ? val : [val]) : undefined)),
});

// Schemas from api/2014/classController.ts
export const ClassLevelsQuerySchema = z.object({
  subclass: z.string().min(1).optional(),
});

// Schemas from api/2014/monsterController.ts
// --- Helper Transformation ---
const transformChallengeRating = (val: string | string[] | undefined) => {
  if (!val) return undefined;
  // Ensure it's an array, handling both single string and array inputs
  const arr = Array.isArray(val) ? val : [val];
  // Flatten in case of comma-separated strings inside the array, then split
  const flattened = arr.flatMap((item) => item.split(','));
  // Convert to numbers and filter out NaNs
  const numbers = flattened.map(Number).filter((item) => !isNaN(item));
  // Return undefined if no valid numbers result, otherwise return the array
  return numbers.length > 0 ? numbers : undefined;
};
export const MonsterIndexQuerySchema = z.object({
  name: z.string().optional(),
  challenge_rating: z
    .union([z.string(), z.array(z.string())]) // Accept string or array
    .optional()
    .transform(transformChallengeRating), // Use helper transformation
});
