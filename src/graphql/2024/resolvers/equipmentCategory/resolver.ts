import { Arg, Args, FieldResolver, Query, Resolver, Root } from 'type-graphql'

import { AnyEquipment } from '@/graphql/2024/common/unions'
import { buildSortPipeline } from '@/graphql/common/args'
import EquipmentModel, { Equipment2024 } from '@/models/2024/equipment'
import EquipmentCategoryModel, { EquipmentCategory2024 } from '@/models/2024/equipmentCategory'
import { escapeRegExp } from '@/util'

import {
  EQUIPMENT_CATEGORY_SORT_FIELD_MAP,
  EquipmentCategoryArgs,
  EquipmentCategoryArgsSchema,
  EquipmentCategoryIndexArgsSchema,
  EquipmentCategoryOrderField
} from './args'

@Resolver(EquipmentCategory2024)
export class EquipmentCategoryResolver {
  @Query(() => [EquipmentCategory2024], {
    description: 'Gets all equipment categories, optionally filtered by name and sorted by name.'
  })
  async equipmentCategories(
    @Args(() => EquipmentCategoryArgs) args: EquipmentCategoryArgs
  ): Promise<EquipmentCategory2024[]> {
    const validatedArgs = EquipmentCategoryArgsSchema.parse(args)
    const query = EquipmentCategoryModel.find()

    if (validatedArgs.name != null && validatedArgs.name !== '') {
      query.where({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    const sortQuery = buildSortPipeline<EquipmentCategoryOrderField>({
      order: validatedArgs.order,
      sortFieldMap: EQUIPMENT_CATEGORY_SORT_FIELD_MAP,
      defaultSortField: EquipmentCategoryOrderField.NAME
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

  @Query(() => EquipmentCategory2024, {
    nullable: true,
    description: 'Gets a single equipment category by index.'
  })
  async equipmentCategory(
    @Arg('index', () => String) indexInput: string
  ): Promise<EquipmentCategory2024 | null> {
    const { index } = EquipmentCategoryIndexArgsSchema.parse({ index: indexInput })
    return EquipmentCategoryModel.findOne({ index }).lean()
  }

  // TODO: Remove when Magic Items are added
  @FieldResolver(() => [AnyEquipment])
  async equipment(@Root() equipmentCategory: EquipmentCategory2024): Promise<Equipment2024[]> {
    if (equipmentCategory.equipment.length === 0) {
      return []
    }

    const equipmentIndices = equipmentCategory.equipment.map((ref) => ref.index)

    const equipments = await EquipmentModel.find({ index: { $in: equipmentIndices } }).lean()

    return equipments
  }

  // TODO: Add Magic Items
  // @FieldResolver(() => [EquipmentOrMagicItem])
  // async equipment(
  //   @Root() equipmentCategory: EquipmentCategory
  // ): Promise<(Equipment | MagicItem)[]> {
  //   if (equipmentCategory.equipment.length === 0) {
  //     return []
  //   }

  //   const equipmentIndices = equipmentCategory.equipment.map((ref) => ref.index)

  //   // Fetch both Equipment and MagicItems matching the indices
  //   const [equipments, magicItems] = await Promise.all([
  //     EquipmentModel.find({ index: { $in: equipmentIndices } }).lean(),
  //     MagicItemModel.find({ index: { $in: equipmentIndices } }).lean()
  //   ])

  //   return [...equipments, ...magicItems]
  // }
}
