import { Resolver, Query, Arg, Args } from 'type-graphql'
import WeaponPropertyModel, { WeaponProperty } from '@/models/2014/weaponProperty'
import { escapeRegExp } from '@/util'
import { buildMongoSortQuery } from '@/graphql/2014/common/inputs'
import { WeaponPropertyArgs, WeaponPropertyArgsSchema, WeaponPropertyIndexArgsSchema } from './args'

@Resolver(WeaponProperty)
export class WeaponPropertyResolver {
  @Query(() => [WeaponProperty], {
    description: 'Gets all weapon properties, optionally filtered by name and sorted by name.'
  })
  async weaponProperties(@Args() args: WeaponPropertyArgs): Promise<WeaponProperty[]> {
    const validatedArgs = WeaponPropertyArgsSchema.parse(args)
    const query = WeaponPropertyModel.find()

    if (validatedArgs.name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    const sortQuery = buildMongoSortQuery({
      orderDirection: validatedArgs.order_direction,
      defaultSortField: 'name'
    })

    if (sortQuery) {
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
  async weaponProperty(@Arg('index') indexInput: string): Promise<WeaponProperty | null> {
    const { index } = WeaponPropertyIndexArgsSchema.parse({ index: indexInput })
    return WeaponPropertyModel.findOne({ index }).lean()
  }
}
