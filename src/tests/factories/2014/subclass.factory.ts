import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import type { Subclass, SubclassSpell } from '@/models/2014/subclass'
import { apiReferenceFactory } from './common.factory'

const createIndex = (name: string): string =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
const createUrl = (index: string): string => `/api/subclasses/${index}`

// --- SubclassSpell Factory ---
// Note: The prerequisites structure in the model (array of APIReference) might need refinement
// depending on what a "spell prerequisite" typically represents (e.g., level, other spell).
// This factory assumes they are generic APIReferences for now.
const subclassSpellFactory = Factory.define<SubclassSpell>(({ params }) => {
  // Build dependencies first
  const builtPrereqs = apiReferenceFactory.buildList(
    params.prerequisites?.length ?? faker.number.int({ min: 0, max: 1 })
  )
  const builtSpell = apiReferenceFactory.build(params.spell)

  return {
    prerequisites: builtPrereqs.map((p) => ({
      index: p.index,
      name: p.name,
      url: p.url
    })),
    spell: {
      index: builtSpell.index,
      name: builtSpell.name,
      url: builtSpell.url
    }
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
      class: {
        index: builtClass.index,
        name: builtClass.name,
        url: builtClass.url
      },
      subclass_flavor: params.subclass_flavor ?? faker.lorem.words(3),
      desc: params.desc ?? [faker.lorem.paragraph()],
      subclass_levels: params.subclass_levels ?? faker.number.int({ min: 1, max: 20 }), // Needs clarification - is this the number of levels or the URL?
      spells: spells?.map((s) => ({
        // Map to ensure correct type if spells exist
        prerequisites: s.prerequisites,
        spell: s.spell
      })),
      url: params.url ?? createUrl(index),
      updated_at: params.updated_at ?? faker.date.past().toISOString()
    }
  }
)
