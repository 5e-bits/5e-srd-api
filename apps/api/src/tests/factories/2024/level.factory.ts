import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { Level2024 } from '@/models/2024/level'
import { APIReference } from '@/models/common/apiReference'

const apiReferenceFactory = Factory.define<APIReference>(() => ({
  index: faker.lorem.slug(),
  name: faker.lorem.words(2),
  url: `/api/2024/${faker.lorem.slug()}`
}))

export const levelFactory = Factory.define<Level2024>(({ sequence, params }) => {
  const level = params.level ?? ((sequence - 1) % 20) + 1
  const classRef = apiReferenceFactory.build(params.class)
  const subclassRef = params.subclass ? apiReferenceFactory.build(params.subclass) : undefined
  const parentRef = subclassRef ?? classRef

  return {
    index: `${parentRef.index}-${level}`,
    name: `${parentRef.name} ${level}`,
    level,
    prof_bonus: Math.floor((level - 1) / 4) + 2,
    class: classRef,
    subclass: subclassRef,
    url: `${parentRef.url}/levels/${level}`,
    updated_at: faker.date.recent().toISOString()
  }
})
