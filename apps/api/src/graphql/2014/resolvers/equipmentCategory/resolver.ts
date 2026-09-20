import { FieldResolver, Resolver, Root } from 'type-graphql'

import { EquipmentOrMagicItem } from '@/graphql/2014/common/unions'
import { createResolver } from '@/graphql/common/createResolver'
import EquipmentModel, { Equipment } from '@/models/2014/equipment'
import EquipmentCategoryModel, { EquipmentCategory } from '@/models/2014/equipmentCategory'
import MagicItemModel, { MagicItem } from '@/models/2014/magicItem'

@Resolver(EquipmentCategory)
export class EquipmentCategoryResolver extends createResolver({
  Type: EquipmentCategory,
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
