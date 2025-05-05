import { Resolver, Query, Arg, Args, ArgsType, Field } from 'type-graphql'
import { WeaponProperty } from '@/models/2014/weaponProperty' // Import the decorated Typegoose model
import WeaponPropertyModel from '@/models/2014/weaponProperty' // Import the default export for data access
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums' // Import shared enum
import { IsOptional, IsString, IsEnum } from 'class-validator'
import { escapeRegExp } from '@/util'

// Define ArgsType for the weaponProperties query
@ArgsType()
class WeaponPropertyArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by weapon property name (case-insensitive, partial match)'
  })
  @IsOptional()
  @IsString()
  name?: string

  @Field(() => OrderByDirection, {
    nullable: true,
    defaultValue: OrderByDirection.ASC,
    description: 'Sort direction (default: ASC)'
  })
  @IsOptional()
  @IsEnum(OrderByDirection)
  order_direction?: OrderByDirection

  // Note: Sorting is hardcoded by 'name'
}

@Resolver(WeaponProperty)
export class WeaponPropertyResolver {
  @Query(() => [WeaponProperty], {
    description: 'Gets all weapon properties, optionally filtered by name and sorted by name.'
  })
  async weaponProperties(
    @Args() { name, order_direction }: WeaponPropertyArgs
  ): Promise<WeaponProperty[]> {
    const query = WeaponPropertyModel.find()

    if (name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
    }

    if (order_direction) {
      query.sort({ name: order_direction === OrderByDirection.DESC ? -1 : 1 })
    }

    return query.lean()
  }

  @Query(() => WeaponProperty, {
    nullable: true,
    description: 'Gets a single weapon property by index.'
  })
  async weaponProperty(@Arg('index', () => String) index: string): Promise<WeaponProperty | null> {
    return WeaponPropertyModel.findOne({ index }).lean()
  }
}
