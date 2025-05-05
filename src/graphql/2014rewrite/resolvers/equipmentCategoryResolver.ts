import { Resolver, Query, Arg, Args, ArgsType, Field, FieldResolver, Root } from 'type-graphql'
import { EquipmentCategory } from '@/models/2014/equipmentCategory' // Import the decorated Typegoose model
import EquipmentCategoryModel from '@/models/2014/equipmentCategory' // Import the default export for data access
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums' // Import shared enum
import { IsOptional, IsString, IsEnum } from 'class-validator'
import { escapeRegExp } from '@/util'
import { Equipment } from '@/models/2014/equipment'
import EquipmentModel from '@/models/2014/equipment'
import { MagicItem } from '@/models/2014/magicItem'
import MagicItemModel from '@/models/2014/magicItem'
import { EquipmentOrMagicItem } from '@/graphql/2014rewrite/common/unions'

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

    if (order_direction) {
      query.sort({ name: order_direction === OrderByDirection.DESC ? -1 : 1 })
    }

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

  @FieldResolver(() => [EquipmentOrMagicItem])
  async equipment(
    @Root() equipmentCategory: EquipmentCategory
  ): Promise<(Equipment | MagicItem)[]> {
    if (!equipmentCategory.equipment || equipmentCategory.equipment.length === 0) {
      return []
    }

    const equipmentIndices = equipmentCategory.equipment.map((ref) => ref.index)

    // Fetch both Equipment and MagicItems matching the indices
    const [equipments, magicItems] = await Promise.all([
      EquipmentModel.find({ index: { $in: equipmentIndices } }).lean(),
      MagicItemModel.find({ index: { $in: equipmentIndices } }).lean()
    ])

    // Combine and return
    // Note: The union's resolveType will handle differentiating them in the GraphQL response
    return [...equipments, ...magicItems]
  }
}
