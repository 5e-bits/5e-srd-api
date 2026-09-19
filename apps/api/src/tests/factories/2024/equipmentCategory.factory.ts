import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { EquipmentCategory2024 } from '@/models/2024/equipmentCategory'

import { apiReferenceFactory } from './common.factory' // Import common factory

export const equipmentCategoryFactory = Factory.define<EquipmentCategory2024>(({ sequence }) => {
  const name = `Equipment Category ${sequence} - ${faker.lorem.words(2)}`
  const index = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return {
    index: index,
    name: name,
    equipment: apiReferenceFactory.buildList(faker.number.int({ min: 1, max: 5 })), // Build a list of equipment references
    url: `/api/equipment-categories/${index}`,
    updated_at: faker.date.recent().toISOString()
  }
})
