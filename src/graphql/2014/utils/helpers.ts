import { LevelValue } from '@/graphql/2014/common/types'
import { createRequire } from 'module'

// Create a require function relative to the current module
export const customRequire = createRequire(import.meta.url)

/**
 * Converts a Record<number, string> or Record<string, string> (where keys are number strings)
 * into an array of { level: number, value: string } objects, sorted by level.
 * Returns null if the input is invalid or empty.
 */
export const mapLevelObjectToArray = (
  data: Record<number, string> | Record<string, string> | undefined
): LevelValue[] | null => {
  if (!data || typeof data !== 'object') {
    return null
  }

  const levelValueArray: LevelValue[] = []
  // Cast data to Record<string, string> for safe indexing
  const stringData = data as Record<string, string>
  for (const levelKey in stringData) {
    if (Object.prototype.hasOwnProperty.call(stringData, levelKey)) {
      const level = parseInt(levelKey, 10)
      const value = stringData[levelKey]

      if (!isNaN(level) && typeof value === 'string') {
        levelValueArray.push({ level, value })
      }
    }
  }
  levelValueArray.sort((a, b) => a.level - b.level)
  return levelValueArray.length > 0 ? levelValueArray : null
}

/**
 * Normalizes a count value (which can be a string or number) to a number.
 * Uses parseInt with radix 10 for strings.
 */
export function normalizeCount(count: string | number): number {
  if (typeof count === 'string') {
    const num = parseInt(count, 10)
    // It's good practice to check if parseInt resulted in NaN,
    // though for counts that are expected to be numbers or numeric strings,
    // this might be overly cautious or depend on how bad data should be handled.
    // For now, assuming valid numeric strings if it's a string.
    return isNaN(num) ? 0 : num // Default to 0 if string is not a valid number, or handle error
  }
  return count
}
