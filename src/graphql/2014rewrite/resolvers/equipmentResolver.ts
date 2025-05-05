import { Resolver, Query, Arg, Args, ArgsType, Field } from 'type-graphql'
import EquipmentModel, { Equipment } from '@/models/2014/equipment'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { IsOptional, IsString, IsEnum } from 'class-validator'
import { escapeRegExp } from '@/util'

@ArgsType()
class EquipmentArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by magic item name (case-insensitive, partial match)'
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
}

@Resolver(Equipment)
export class EquipmentResolver {
  @Query(() => [Equipment], {
    description: 'Query all Equipment, optionally filtered by name and sorted by name.'
  })
  async equipments(@Args() { name, order_direction }: EquipmentArgs): Promise<Equipment[]> {
    const query = EquipmentModel.find()

    if (name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
    }

    if (order_direction) {
      query.sort({ name: order_direction === OrderByDirection.DESC ? -1 : 1 })
    }

    // Note: .lean() is used, so reference fields will contain raw data
    // FieldResolvers will be added in Pass 2.
    return query.lean()
  }

  @Query(() => Equipment, {
    nullable: true,
    description: 'Gets a single equipment by index.'
  })
  async equipment(@Arg('index', () => String) index: string): Promise<Equipment | null> {
    return EquipmentModel.findOne({ index }).lean()
  }

  // TODO: Pass 2/3 - Field resolvers for complex fields
}
