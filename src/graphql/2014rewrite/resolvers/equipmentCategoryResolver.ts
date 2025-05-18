import { Resolver, Query, Arg, Args, ArgsType, Field, FieldResolver, Root } from 'type-graphql'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { IsOptional, IsString, IsEnum } from 'class-validator'
import { escapeRegExp } from '@/util'
import EquipmentModel, { Equipment } from '@/models/2014/equipment'
import EquipmentCategoryModel, { EquipmentCategory } from '@/models/2014/equipmentCategory'
import MagicItemModel, { MagicItem } from '@/models/2014/magicItem'
import { EquipmentOrMagicItem } from '@/graphql/2014rewrite/common/unions'
import { buildMongoSortQuery } from '../common/inputs'

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

    const sortQuery = buildMongoSortQuery({
      defaultSortField: 'name',
      orderDirection: order_direction
    })
    if (sortQuery) {
      query.sort(sortQuery)
    }

    return query.lean()
  }

  @Query(() => EquipmentCategory, {
    nullable: true,
    description: 'Gets a single equipment category by index.'
  })
  async equipmentCategory(
    @Arg('index', () => String) index: string
  ): Promise<EquipmentCategory | null> {
    return EquipmentCategoryModel.findOne({ index }).lean()
  }

  @FieldResolver(() => [EquipmentOrMagicItem])
  async equipment(
    @Root() equipmentCategory: EquipmentCategory
  ): Promise<(Equipment | MagicItem)[]> {
    if (equipmentCategory.equipment.length === 0) {
      return []
    }

    const equipmentIndices = equipmentCategory.equipment.map((ref) => ref.index)

    // Fetch both Equipment and MagicItems matching the indices
    const [equipments, magicItems] = await Promise.all([
      EquipmentModel.find({ index: { $in: equipmentIndices } }).lean(),
      MagicItemModel.find({ index: { $in: equipmentIndices } }).lean()
    ])

    return [...equipments, ...magicItems]
  }
}
