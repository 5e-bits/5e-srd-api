import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { AbilityScore2024 } from '@/models/2024/abilityScore'

import { apiReferenceFactory } from './common.factory'

// Define the factory using fishery
export const abilityScoreFactory = Factory.define<AbilityScore2024>(
  ({ sequence, params, transientParams }) => {
    // params are overrides
    // transientParams are params not part of the final object, useful for intermediate logic
    // sequence provides a unique number for each generated object

    // Use transientParams for defaults that might be complex or used multiple times
    const name = params.name ?? transientParams.baseName ?? `Ability Score ${sequence}`
    const index = params.index ?? name.toLowerCase().replace(/\s+/g, '-')

    return {
      // Required fields
      index,
      name,
      full_name: params.full_name ?? `Full ${name}`,
      description: params.description ?? faker.lorem.paragraph(), // Simplified default
      url: params.url ?? `/api/ability-scores/${index}`,
      updated_at: params.updated_at ?? faker.date.recent().toISOString(),

      // Non-required fields - Use the imported factory
      skills: params.skills ?? apiReferenceFactory.buildList(2), // Build a list of 2 APIReferences

      // Merging params ensures overrides work correctly
      ...params
    }
  }
)
