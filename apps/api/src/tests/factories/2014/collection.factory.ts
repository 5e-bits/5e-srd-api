import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { createIndex } from './common.factory'

import type { Collection } from '@/models/2014/collection'

// Factory only needs to define properties present in the Collection model
export const collectionFactory = Factory.define<Omit<Collection, '_id' | 'collectionName'>>(
  ({ sequence, params }) => {
    // Generate a plausible index, or use one provided
    const index = params.index ?? createIndex(`${faker.word.noun()} ${sequence}`)

    return {
      index
    }
  }
)
