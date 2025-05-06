import { Resolver, FieldResolver, Root } from 'type-graphql'
import { ActionDamage, LevelDamage } from '@/models/2014/trait'

@Resolver(ActionDamage)
export class ActionDamageResolver {
  @FieldResolver(() => [LevelDamage], {
    nullable: true,
    description: 'Damage scaling based on character level, transformed from the raw data object.'
  })
  async damage_at_character_level(
    @Root() actionDamage: ActionDamage
  ): Promise<LevelDamage[] | null> {
    const data = actionDamage.damage_at_character_level

    if (!data || typeof data !== 'object') {
      return null
    }

    const levelDamageArray: LevelDamage[] = []
    for (const levelKey in data) {
      if (Object.prototype.hasOwnProperty.call(data, levelKey)) {
        const level = parseInt(levelKey, 10)
        const damage = data[levelKey]

        if (!isNaN(level) && typeof damage === 'string') {
          levelDamageArray.push({ level, damage })
        }
      }
    }

    // Sort by level for predictable order
    levelDamageArray.sort((a, b) => a.level - b.level)

    return levelDamageArray.length > 0 ? levelDamageArray : null
  }
}
