import { Resolver } from 'type-graphql'

import { createResolver } from '@/graphql/common/createResolver'
import MagicSchoolModel, { MagicSchool2024 } from '@/models/2024/magicSchool'

@Resolver(MagicSchool2024)
export class MagicSchoolResolver extends createResolver({
  Type: MagicSchool2024,
  Model: MagicSchoolModel,
  typeName: 'MagicSchool',
  singular: 'magicSchool',
  plural: 'magicSchools',
  descriptions: {
    fields: 'Fields to sort Magic Schools by',
    order: 'Specify sorting order for magic schools.',
    list: 'Gets all magic schools, optionally filtered by name and sorted by name.',
    single: 'Gets a single magic school by index.'
  }
}) {}
