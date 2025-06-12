import { Arg, Args, Query, Resolver } from 'type-graphql'

import { buildSortPipeline } from '@/graphql/common/args'
import WeaponMasteryPropertyModel, {
  WeaponMasteryProperty2024
} from '@/models/2024/weaponMasteryProperty'
import { escapeRegExp } from '@/util'

import {
  WEAPON_MASTERY_PROPERTY_SORT_FIELD_MAP,
  WeaponMasteryPropertyArgs,
  WeaponMasteryPropertyArgsSchema,
  WeaponMasteryPropertyIndexArgsSchema,
  WeaponMasteryPropertyOrderField
} from './args'

@Resolver(WeaponMasteryProperty2024)
export class WeaponMasteryPropertyResolver {
  @Query(() => [WeaponMasteryProperty2024], {
    description:
      'Gets all weapon mastery properties, optionally filtered by name and sorted by name.'
  })
  async weaponMasteryProperties(
    @Args(() => WeaponMasteryPropertyArgs) args: WeaponMasteryPropertyArgs
  ): Promise<WeaponMasteryProperty2024[]> {
    const validatedArgs = WeaponMasteryPropertyArgsSchema.parse(args)
    const query = WeaponMasteryPropertyModel.find()

    if (validatedArgs.name != null && validatedArgs.name !== '') {
      query.where({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    const sortQuery = buildSortPipeline<WeaponMasteryPropertyOrderField>({
      order: validatedArgs.order,
      sortFieldMap: WEAPON_MASTERY_PROPERTY_SORT_FIELD_MAP,
      defaultSortField: WeaponMasteryPropertyOrderField.NAME
    })

    if (Object.keys(sortQuery).length > 0) {
      query.sort(sortQuery)
    }

    if (validatedArgs.skip) {
      query.skip(validatedArgs.skip)
    }
    if (validatedArgs.limit) {
      query.limit(validatedArgs.limit)
    }

    return query.lean()
  }

  @Query(() => WeaponMasteryProperty2024, {
    nullable: true,
    description: 'Gets a single weapon mastery property by index.'
  })
  async weaponMasteryProperty(
    @Arg('index', () => String) indexInput: string
  ): Promise<WeaponMasteryProperty2024 | null> {
    const { index } = WeaponMasteryPropertyIndexArgsSchema.parse({ index: indexInput })
    return WeaponMasteryPropertyModel.findOne({ index }).lean()
  }
}
