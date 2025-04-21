import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import type { Collection } from '@/models/2014/collection'

// Helper function
const createIndex = (name: string): string =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

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
