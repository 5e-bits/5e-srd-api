import { Resolver } from 'type-graphql'

import { createResolver } from '@/graphql/common/createResolver'
import AlignmentModel, { Alignment } from '@/models/2014/alignment'

@Resolver(Alignment)
export class AlignmentResolver extends createResolver({
  Type: Alignment,
  Model: AlignmentModel,
  typeName: 'Alignment',
  singular: 'alignment',
  plural: 'alignments',
  descriptions: {
    fields: 'Fields to sort Alignments by',
    order: 'Specify sorting order for alignments.',
    list: 'Gets all alignments, optionally filtered by name and sorted.',
    single: 'Gets a single alignment by index.'
  }
}) {}
