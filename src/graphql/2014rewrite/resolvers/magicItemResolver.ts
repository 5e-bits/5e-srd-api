import { Resolver, Query, Arg, Args, ArgsType, Field } from 'type-graphql'
import { MagicItem } from '@/models/2014/magicItem' // Import the decorated Typegoose model
import MagicItemModel from '@/models/2014/magicItem' // Import the default export for data access
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums' // Import shared enum
import { IsOptional, IsString, IsEnum } from 'class-validator'
import { escapeRegExp } from '@/util'
// Import related types if needed for FieldResolver placeholders
// import { EquipmentCategory } from '@/models/2014/equipmentCategory';

// Define ArgsType for the magicItems query
@ArgsType()
class MagicItemArgs {
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

@Resolver(MagicItem)
export class MagicItemResolver {
  @Query(() => [MagicItem], {
    description: 'Gets all magic items, optionally filtered by name and sorted by name.'
  })
  async magicItems(@Args() { name, order_direction }: MagicItemArgs): Promise<MagicItem[]> {
    const query = MagicItemModel.find()

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

  @Query(() => MagicItem, { nullable: true, description: 'Gets a single magic item by index.' })
  async magicItem(@Arg('index', () => String) index: string): Promise<MagicItem | null> {
    // Note: .lean() is used, reference fields will contain raw data.
    // FieldResolvers needed in Pass 2.
    return MagicItemModel.findOne({ index }).lean()
  }

  // Field Resolvers for references (equipment_category, variants) will be added in Pass 2
}
