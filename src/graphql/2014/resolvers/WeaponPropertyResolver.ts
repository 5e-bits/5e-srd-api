import { Resolver, Query, Arg, Args } from 'type-graphql'
import { WeaponProperty } from '@/models/2014/weaponProperty'
import WeaponPropertyModel from '@/models/2014/weaponProperty'
import { BaseResolver } from '@/graphql/common/resolvers/BaseResolver'
import { NameSortArgs } from '@/graphql/common/args/NameSortArgs'

@Resolver(WeaponProperty)
export class WeaponPropertyResolver extends BaseResolver<WeaponProperty> {
  constructor() {
    super(WeaponPropertyModel, WeaponProperty)
  }

  @Query(() => WeaponProperty, {
    nullable: true,
    description: 'Gets a single weapon property by index.'
  })
  async weaponProperty(@Arg('index', () => String) index: string): Promise<WeaponProperty | null> {
    return this._findOneByIndex(index)
  }

  @Query(() => [WeaponProperty], {
    description: 'Gets all weapon properties, optionally filtered and sorted.'
  })
  async weaponProperties(@Args(() => NameSortArgs) args: NameSortArgs): Promise<WeaponProperty[]> {
    return this._find(args)
  }
}
