import { Arg, Args, Query, Resolver } from 'type-graphql'

import { buildSortPipeline } from '@/graphql/common/args'
import WeaponPropertyModel, { WeaponProperty } from '@/models/2014/weaponProperty'
import { escapeRegExp } from '@/util'

import {
  WEAPON_PROPERTY_SORT_FIELD_MAP,
  WeaponPropertyArgs,
  WeaponPropertyArgsSchema,
  WeaponPropertyIndexArgsSchema,
  WeaponPropertyOrderField
} from './args'

@Resolver(WeaponProperty)
export class WeaponPropertyResolver {
  @Query(() => [WeaponProperty], {
    description: 'Gets all weapon properties, optionally filtered by name and sorted by name.'
  })
  async weaponProperties(
    @Args(() => WeaponPropertyArgs) args: WeaponPropertyArgs
  ): Promise<WeaponProperty[]> {
    const validatedArgs = WeaponPropertyArgsSchema.parse(args)
    const query = WeaponPropertyModel.find()

    if (validatedArgs.name != null && validatedArgs.name !== '') {
      query.where({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    const sortQuery = buildSortPipeline<WeaponPropertyOrderField>({
      order: validatedArgs.order,
      sortFieldMap: WEAPON_PROPERTY_SORT_FIELD_MAP,
      defaultSortField: WeaponPropertyOrderField.NAME
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

  @Query(() => WeaponProperty, {
    nullable: true,
    description: 'Gets a single weapon property by index.'
  })
  async weaponProperty(
    @Arg('index', () => String) indexInput: string
  ): Promise<WeaponProperty | null> {
    const { index } = WeaponPropertyIndexArgsSchema.parse({ index: indexInput })
    return WeaponPropertyModel.findOne({ index }).lean()
  }
}
