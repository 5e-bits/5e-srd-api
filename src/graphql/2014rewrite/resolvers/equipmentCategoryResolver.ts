import { Resolver, Query, Arg, Args, ArgsType, Field } from 'type-graphql'
import { EquipmentCategory } from '@/models/2014/equipmentCategory' // Import the decorated Typegoose model
import EquipmentCategoryModel from '@/models/2014/equipmentCategory' // Import the default export for data access
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums' // Import shared enum
import { IsOptional, IsString, IsEnum } from 'class-validator'
import { escapeRegExp } from '@/util'

// Define ArgsType for the equipmentCategories query
@ArgsType()
class EquipmentCategoryArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by category name (case-insensitive, partial match)'
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

@Resolver(EquipmentCategory)
export class EquipmentCategoryResolver {
  @Query(() => [EquipmentCategory], {
    description: 'Gets all equipment categories, optionally filtered by name and sorted by name.'
  })
  async equipmentCategories(
    @Args() { name, order_direction }: EquipmentCategoryArgs
  ): Promise<EquipmentCategory[]> {
    const query = EquipmentCategoryModel.find()

    if (name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
    }

    const sortOrder = order_direction === OrderByDirection.DESC ? -1 : 1
    query.sort({ name: sortOrder })

    // Note: .lean() is used, so the equipment field will contain the raw APIReference data
    // A FieldResolver will be added in Pass 2 to resolve these references properly.
    return query.lean()
  }

  @Query(() => EquipmentCategory, {
    nullable: true,
    description: 'Gets a single equipment category by index.'
  })
  async equipmentCategory(
    @Arg('index', () => String) index: string
  ): Promise<EquipmentCategory | null> {
    // Note: .lean() is used, equipment field will be raw APIReference data.
    // FieldResolver needed in Pass 2.
    return EquipmentCategoryModel.findOne({ index }).lean()
  }

  // Field Resolver for 'equipment' will be added in Pass 2
  /*
  @FieldResolver(() => [SomeEquipmentInterfaceOrUnion]) // TODO: Define appropriate return type
  async equipment(@Root() equipmentCategory: EquipmentCategory): Promise<any[]> { // TODO: Define appropriate return type
    // Logic to fetch Equipment/MagicItem based on equipmentCategory.equipment references
    // Remember to handle potential Interface/Union types
    return []; // Placeholder
  }
  */
}
