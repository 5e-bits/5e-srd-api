import { FieldResolver, Resolver, Root } from 'type-graphql'

import { AnyEquipmentOrMagicItem } from '@/graphql/2024/common/unions'
import { createResolver } from '@/graphql/common/createResolver'
import EquipmentModel, { Equipment2024 } from '@/models/2024/equipment'
import EquipmentCategoryModel, { EquipmentCategory2024 } from '@/models/2024/equipmentCategory'
import MagicItemModel, { MagicItem2024 } from '@/models/2024/magicItem'

@Resolver(EquipmentCategory2024)
export class EquipmentCategoryResolver extends createResolver({
  Type: EquipmentCategory2024,
  Model: EquipmentCategoryModel,
  typeName: 'EquipmentCategory',
  singular: 'equipmentCategory',
  plural: 'equipmentCategories',
  descriptions: {
    fields: 'Fields to sort Equipment Categories by',
    order: 'Specify sorting order for equipment categories.',
    list: 'Gets all equipment categories, optionally filtered by name and sorted by name.',
    single: 'Gets a single equipment category by index.'
  }
}) {
  @FieldResolver(() => [AnyEquipmentOrMagicItem])
  async equipment(
    @Root() equipmentCategory: EquipmentCategory2024
  ): Promise<(Equipment2024 | MagicItem2024)[]> {
    if (equipmentCategory.equipment.length === 0) {
      return []
    }

    const equipmentIndices = equipmentCategory.equipment.map((ref) => ref.index)

    const [equipments, magicItems] = await Promise.all([
      EquipmentModel.find({ index: { $in: equipmentIndices } }).lean(),
      MagicItemModel.find({ index: { $in: equipmentIndices } }).lean()
    ])

    return [...equipments, ...magicItems]
  }
}
