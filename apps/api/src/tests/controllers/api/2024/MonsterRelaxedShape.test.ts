import { describe, expect, it } from 'vitest'

import Monster2024Model from '@/models/2024/monster'
import { apiReferenceFactory, damageFactory } from '@/tests/factories/2024/common.factory'
import {
  monsterActionFactory,
  monsterArmorClassFactory,
  monsterFactory,
  monsterSpellcastingFactory,
  reactionFactory,
  legendaryActionFactory,
  specialAbilityFactory
} from '@/tests/factories/2024/monster.factory'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const dbUri = generateUniqueDbUri('monster2024relaxed')

setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(Monster2024Model)

const roundTrip = async (data: ReturnType<typeof monsterFactory.build>) => {
  await Monster2024Model.insertMany([data])
  return Monster2024Model.findOne({ index: data.index }).lean()
}

describe('Monster2024 model accepts the generated data shape', () => {
  it('armor_class without type, with armor references', async () => {
    const armor = [
      apiReferenceFactory.build({
        index: 'chain-shirt',
        name: 'Chain Shirt',
        url: '/api/2024/equipment/chain-shirt'
      })
    ]
    const monster = await roundTrip(
      monsterFactory.build({ armor_class: [monsterArmorClassFactory.build({ value: 16, armor })] })
    )
    expect(monster?.armor_class[0].type).toBeUndefined()
    expect(monster?.armor_class[0].armor?.[0].index).toBe('chain-shirt')
  })

  it('armor_class with type still works', async () => {
    const monster = await roundTrip(
      monsterFactory.build({ armor_class: [monsterArmorClassFactory.build({ type: 'natural' })] })
    )
    expect(monster?.armor_class[0].type).toBe('natural')
  })

  it('DC without dc_value', async () => {
    const dc = { dc_type: apiReferenceFactory.build(), success_type: 'none' as const }
    const monster = await roundTrip(
      monsterFactory.build({
        special_abilities: [specialAbilityFactory.build({ name: 'Undead Fortitude', dc })]
      })
    )
    expect(monster?.special_abilities?.[0].dc?.dc_value).toBeUndefined()
  })

  it('choice with choose > 1, no desc, and a special option type', async () => {
    const action = monsterActionFactory.build({
      action_options: {
        choose: 3,
        type: 'action',
        from: {
          option_set_type: 'options_array',
          options: [
            { option_type: 'action', action_name: 'Claw', count: 3, type: 'melee' },
            { option_type: 'action', action_name: 'Roar', count: 1, type: 'special' }
          ]
        }
      } as any
    })
    const monster = await roundTrip(monsterFactory.build({ actions: [action] }))
    const choice = monster?.actions?.[0].action_options
    expect(choice?.choose).toBe(3)
    expect(choice?.desc).toBeUndefined()
  })

  it('skills, gear, bonus_actions, reaction damage/spellcasting, legendary spellcasting', async () => {
    const spellcasting = monsterSpellcastingFactory.build()
    const monster = await roundTrip(
      monsterFactory.build({
        skills: 'History +12, Perception +10',
        gear: 'Chain Shirt, Shield, Spear',
        bonus_actions: [monsterActionFactory.build({ name: 'Misty Step' })],
        reactions: [
          reactionFactory.build({ damage: damageFactory.buildList(1) }),
          reactionFactory.build({ spellcasting })
        ],
        legendary_actions: [legendaryActionFactory.build({ spellcasting })]
      })
    )
    expect(monster?.skills).toBe('History +12, Perception +10')
    expect(monster?.gear).toBe('Chain Shirt, Shield, Spear')
    expect(monster?.bonus_actions?.[0].name).toBe('Misty Step')
    expect(monster?.reactions?.[0].damage).toHaveLength(1)
    expect(monster?.reactions?.[1].spellcasting?.spells).toHaveLength(1)
    expect(monster?.legendary_actions?.[0].spellcasting?.spells).toHaveLength(1)
  })
})
