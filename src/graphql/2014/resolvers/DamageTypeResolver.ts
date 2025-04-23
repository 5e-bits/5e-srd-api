import { Resolver, Query, Arg, Args } from 'type-graphql'
import { DamageType } from '@/models/2014/damageType' // Import the Typegoose model/ObjectType
import DamageTypeModel from '@/models/2014/damageType' // Import the default export for data access
import { BaseResolver } from '@/graphql/common/resolvers/BaseResolver'
import { NameSortArgs } from '@/graphql/common/args/NameSortArgs'

@Resolver(DamageType)
export class DamageTypeResolver extends BaseResolver<DamageType> {
  constructor() {
    super(DamageTypeModel, DamageType)
  }

  @Query(() => DamageType, {
    nullable: true,
    description: 'Gets a single damage type by index.'
  })
  async damageType(@Arg('index', () => String) index: string): Promise<DamageType | null> {
    return this._findOneByIndex(index)
  }

  @Query(() => [DamageType], {
    description: 'Gets all damage types, optionally filtered and sorted.'
  })
  async damageTypes(@Args(() => NameSortArgs) args: NameSortArgs): Promise<DamageType[]> {
    return this._find(args)
  }
}
