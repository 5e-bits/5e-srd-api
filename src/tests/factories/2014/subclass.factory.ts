import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { apiReferenceFactory, createIndex, createUrl } from './common.factory'

import type { Prerequisite, Subclass, SubclassSpell } from '@/models/2014/subclass'

// --- Prerequisite Factory ---
const prerequisiteFactory = Factory.define<Prerequisite>(({ params }) => ({
  index: params.index ?? createIndex(faker.word.adjective()),
  name: params.name ?? faker.word.adjective(),
  type: params.type ?? 'spell',
  url: params.url ?? createUrl('testing', params.index ?? createIndex(faker.word.adjective()))
}))

const subclassSpellFactory = Factory.define<SubclassSpell>(({ params }) => {
  // Build dependencies first
  const builtPrereqs = prerequisiteFactory.buildList(
    params.prerequisites?.length ?? faker.number.int({ min: 0, max: 1 })
  )
  const builtSpell = apiReferenceFactory.build(params.spell)

  return {
    prerequisites: builtPrereqs.map((p) => ({
      index: p.index,
      name: p.name,
      type: p.type,
      url: p.url
    })),
    spell: builtSpell
  }
})

// --- Subclass Factory ---
export const subclassFactory = Factory.define<Omit<Subclass, '_id' | 'collectionName'>>(
  ({ sequence, params }) => {
    const name = params.name ?? `${faker.word.adjective()} Subclass ${sequence}`
    const index = params.index ?? createIndex(name)

    // Build dependencies
    const builtClass = apiReferenceFactory.build(params.class)
    // Optional spells - build list only if params.spells is provided or randomly
    const spells =
      params.spells ??
      (faker.datatype.boolean(0.3)
        ? subclassSpellFactory.buildList(faker.number.int({ min: 1, max: 5 }))
        : undefined)

    return {
      index,
      name,
      class: builtClass,
      subclass_flavor: params.subclass_flavor ?? faker.lorem.words(3),
      desc: params.desc ?? [faker.lorem.paragraph()],
      subclass_levels: params.subclass_levels ?? `/api/subclasses/${index}/levels`,
      spells: spells?.map((s: SubclassSpell) => ({
        prerequisites: s.prerequisites,
        spell: s.spell
      })),
      url: params.url ?? createUrl('subclasses', index),
      updated_at: params.updated_at ?? faker.date.past().toISOString()
    }
  }
)
