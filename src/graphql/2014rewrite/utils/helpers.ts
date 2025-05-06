import { LevelValue } from '@/graphql/2014rewrite/common/types'

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
