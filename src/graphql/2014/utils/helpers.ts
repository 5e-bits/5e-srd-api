import { LevelValue } from '@/graphql/common/types'

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
    return isNaN(num) ? 0 : num
  }
  return count
}
