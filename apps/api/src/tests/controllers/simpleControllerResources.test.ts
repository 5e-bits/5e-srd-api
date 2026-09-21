import { type Model } from 'mongoose'
import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import SimpleController from '@/controllers/simpleController'
import AbilityScore2014Model from '@/models/2014/abilityScore'
import Alignment2014Model from '@/models/2014/alignment'
import Background2014Model from '@/models/2014/background'
import Condition2014Model from '@/models/2014/condition'
import DamageType2014Model from '@/models/2014/damageType'
import Equipment2014Model from '@/models/2014/equipment'
import EquipmentCategory2014Model from '@/models/2014/equipmentCategory'
import Feat2014Model from '@/models/2014/feat'
import Feature2014Model from '@/models/2014/feature'
import Language2014Model from '@/models/2014/language'
import MagicSchool2014Model from '@/models/2014/magicSchool'
import Proficiency2014Model from '@/models/2014/proficiency'
import Skill2014Model from '@/models/2014/skill'
import Trait2014Model from '@/models/2014/trait'
import WeaponProperty2014Model from '@/models/2014/weaponProperty'
import AbilityScore2024Model from '@/models/2024/abilityScore'
import Alignment2024Model from '@/models/2024/alignment'
import Background2024Model from '@/models/2024/background'
import Condition2024Model from '@/models/2024/condition'
import DamageType2024Model from '@/models/2024/damageType'
import Equipment2024Model from '@/models/2024/equipment'
import EquipmentCategory2024Model from '@/models/2024/equipmentCategory'
import Feat2024Model from '@/models/2024/feat'
import Feature2024Model from '@/models/2024/feature'
import Language2024Model from '@/models/2024/language'
import MagicItem2024Model from '@/models/2024/magicItem'
import MagicSchool2024Model from '@/models/2024/magicSchool'
import Monster2024Model from '@/models/2024/monster'
import Poison2024Model from '@/models/2024/poison'
import Proficiency2024Model from '@/models/2024/proficiency'
import Skill2024Model from '@/models/2024/skill'
import Trait2024Model from '@/models/2024/trait'
import WeaponMasteryProperty2024Model from '@/models/2024/weaponMasteryProperty'
import WeaponProperty2024Model from '@/models/2024/weaponProperty'
import { abilityScoreFactory as abilityScore2014Factory } from '@/tests/factories/2014/abilityScore.factory'
import { alignmentFactory as alignment2014Factory } from '@/tests/factories/2014/alignment.factory'
import { backgroundFactory as background2014Factory } from '@/tests/factories/2014/background.factory'
import { conditionFactory as condition2014Factory } from '@/tests/factories/2014/condition.factory'
import { damageTypeFactory as damageType2014Factory } from '@/tests/factories/2014/damageType.factory'
import { equipmentFactory as equipment2014Factory } from '@/tests/factories/2014/equipment.factory'
import { equipmentCategoryFactory as equipmentCategory2014Factory } from '@/tests/factories/2014/equipmentCategory.factory'
import { featFactory as feat2014Factory } from '@/tests/factories/2014/feat.factory'
import { featureFactory as feature2014Factory } from '@/tests/factories/2014/feature.factory'
import { languageFactory as language2014Factory } from '@/tests/factories/2014/language.factory'
import { magicSchoolFactory as magicSchool2014Factory } from '@/tests/factories/2014/magicSchool.factory'
import { proficiencyFactory as proficiency2014Factory } from '@/tests/factories/2014/proficiency.factory'
import { skillFactory as skill2014Factory } from '@/tests/factories/2014/skill.factory'
import { traitFactory as trait2014Factory } from '@/tests/factories/2014/trait.factory'
import { weaponPropertyFactory as weaponProperty2014Factory } from '@/tests/factories/2014/weaponProperty.factory'
import { abilityScoreFactory as abilityScore2024Factory } from '@/tests/factories/2024/abilityScore.factory'
import { alignmentFactory as alignment2024Factory } from '@/tests/factories/2024/alignment.factory'
import { backgroundFactory as background2024Factory } from '@/tests/factories/2024/background.factory'
import { conditionFactory as condition2024Factory } from '@/tests/factories/2024/condition.factory'
import { damageTypeFactory as damageType2024Factory } from '@/tests/factories/2024/damageType.factory'
import {
  equipmentFactory as equipment2024Factory,
  weaponFactory as weapon2024Factory
} from '@/tests/factories/2024/equipment.factory'
import { equipmentCategoryFactory as equipmentCategory2024Factory } from '@/tests/factories/2024/equipmentCategory.factory'
import { featFactory as feat2024Factory } from '@/tests/factories/2024/feat.factory'
import { featureFactory as feature2024Factory } from '@/tests/factories/2024/feature.factory'
import { languageFactory as language2024Factory } from '@/tests/factories/2024/language.factory'
import { magicItemFactory as magicItem2024Factory } from '@/tests/factories/2024/magicItem.factory'
import { magicSchoolFactory as magicSchool2024Factory } from '@/tests/factories/2024/magicSchool.factory'
import { monsterFactory as monster2024Factory } from '@/tests/factories/2024/monster.factory'
import { poisonFactory as poison2024Factory } from '@/tests/factories/2024/poison.factory'
import { proficiencyFactory as proficiency2024Factory } from '@/tests/factories/2024/proficiency.factory'
import { skillFactory as skill2024Factory } from '@/tests/factories/2024/skill.factory'
import { traitFactory as trait2024Factory } from '@/tests/factories/2024/trait.factory'
import { weaponMasteryPropertyFactory as weaponMasteryProperty2024Factory } from '@/tests/factories/2024/weaponMasteryProperty.factory'
import { weaponPropertyFactory as weaponProperty2024Factory } from '@/tests/factories/2024/weaponProperty.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

interface Factory {
  buildList: (count: number) => any[]
}

/** Every resource served by a plain `SimpleController`, with a factory for its documents. */
const resources: [string, Model<any>, Factory][] = [
  ['2014 ability score', AbilityScore2014Model, abilityScore2014Factory],
  ['2014 alignment', Alignment2014Model, alignment2014Factory],
  ['2014 background', Background2014Model, background2014Factory],
  ['2014 condition', Condition2014Model, condition2014Factory],
  ['2014 damage type', DamageType2014Model, damageType2014Factory],
  ['2014 equipment', Equipment2014Model, equipment2014Factory],
  ['2014 equipment category', EquipmentCategory2014Model, equipmentCategory2014Factory],
  ['2014 feat', Feat2014Model, feat2014Factory],
  ['2014 feature', Feature2014Model, feature2014Factory],
  ['2014 language', Language2014Model, language2014Factory],
  ['2014 magic school', MagicSchool2014Model, magicSchool2014Factory],
  ['2014 proficiency', Proficiency2014Model, proficiency2014Factory],
  ['2014 skill', Skill2014Model, skill2014Factory],
  ['2014 trait', Trait2014Model, trait2014Factory],
  ['2014 weapon property', WeaponProperty2014Model, weaponProperty2014Factory],
  ['2024 ability score', AbilityScore2024Model, abilityScore2024Factory],
  ['2024 alignment', Alignment2024Model, alignment2024Factory],
  ['2024 background', Background2024Model, background2024Factory],
  ['2024 condition', Condition2024Model, condition2024Factory],
  ['2024 damage type', DamageType2024Model, damageType2024Factory],
  [
    '2024 equipment',
    Equipment2024Model,
    {
      buildList: (count: number) => [
        ...equipment2024Factory.buildList(count - 1),
        weapon2024Factory.build()
      ]
    }
  ],
  ['2024 equipment category', EquipmentCategory2024Model, equipmentCategory2024Factory],
  ['2024 feat', Feat2024Model, feat2024Factory],
  ['2024 feature', Feature2024Model, feature2024Factory],
  ['2024 language', Language2024Model, language2024Factory],
  ['2024 magic item', MagicItem2024Model, magicItem2024Factory],
  ['2024 magic school', MagicSchool2024Model, magicSchool2024Factory],
  ['2024 monster', Monster2024Model, monster2024Factory],
  ['2024 poison', Poison2024Model, poison2024Factory],
  ['2024 proficiency', Proficiency2024Model, proficiency2024Factory],
  ['2024 skill', Skill2024Model, skill2024Factory],
  ['2024 trait', Trait2024Model, trait2024Factory],
  [
    '2024 weapon mastery property',
    WeaponMasteryProperty2024Model,
    weaponMasteryProperty2024Factory
  ],
  ['2024 weapon property', WeaponProperty2024Model, weaponProperty2024Factory]
]

setupIsolatedDatabase(generateUniqueDbUri('simple-resources'))
teardownIsolatedDatabase()
resources.forEach(([, ResourceModel]) => setupModelCleanup(ResourceModel))

describe.each(resources)('SimpleController with %s', (_label, ResourceModel, factory) => {
  const controller = new SimpleController(ResourceModel)

  it('lists the documents', async () => {
    const docs = factory.buildList(3)
    await ResourceModel.insertMany(docs)
    const response = createResponse()

    await controller.index(createRequest({ query: {} }), response, mockNext)

    expect(response.statusCode).toBe(200)
    const { count, results } = JSON.parse(response._getData())
    expect(count).toBe(3)
    expect(results).toEqual(
      expect.arrayContaining(
        docs.map((d) => expect.objectContaining({ index: d.index, name: d.name }))
      )
    )
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('filters the list by name', async () => {
    const docs = factory.buildList(3)
    await ResourceModel.insertMany(docs)
    const response = createResponse()

    await controller.index(createRequest({ query: { name: docs[1].name } }), response, mockNext)

    const { results } = JSON.parse(response._getData())
    expect(results.map((r: { index: string }) => r.index)).toContain(docs[1].index)
    expect(results.length).toBeLessThan(3)
  })

  it('returns a single document by index', async () => {
    const docs = factory.buildList(2)
    await ResourceModel.insertMany(docs)
    const response = createResponse()

    await controller.show(createRequest({ params: { index: docs[0].index } }), response, mockNext)

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response._getData())).toEqual(
      expect.objectContaining({ index: docs[0].index, name: docs[0].name })
    )
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('calls next() when the index is not found', async () => {
    const response = createResponse()

    await controller.show(
      createRequest({ params: { index: 'does-not-exist' } }),
      response,
      mockNext
    )

    expect(response._getData()).toBe('')
    expect(mockNext).toHaveBeenCalledOnce()
    expect(mockNext).toHaveBeenCalledWith()
  })
})
