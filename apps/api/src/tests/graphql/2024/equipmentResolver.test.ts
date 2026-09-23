import { describe, expect, it } from 'vitest'

import { EquipmentResolver } from '@/graphql/2024/resolvers/equipment/resolver'
import EquipmentModel from '@/models/2024/equipment'
import { equipmentFactory } from '@/tests/factories/2024/equipment.factory'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

setupIsolatedDatabase(generateUniqueDbUri('equipment_resolver_2024'))
teardownIsolatedDatabase()
setupModelCleanup(EquipmentModel)

const category = (index: string) => ({
  index,
  name: index,
  url: `/api/2024/equipment-categories/${index}`
})

describe('EquipmentResolver.list', () => {
  it('filters by equipment_category against equipment_categories', async () => {
    await EquipmentModel.insertMany([
      equipmentFactory.build({ name: 'Longsword', equipment_categories: [category('weapon')] }),
      equipmentFactory.build({
        name: 'Shield',
        equipment_categories: [category('armor'), category('shields')]
      }),
      equipmentFactory.build({ name: 'Rope', equipment_categories: [category('adventuring-gear')] })
    ])

    const result = await new EquipmentResolver().list({ equipment_category: ['weapon', 'shields'] })

    expect(result.map((e) => e.name)).toEqual(['Longsword', 'Shield'])
  })
})
