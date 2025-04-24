import { Resolver, Query, Arg, Args, FieldResolver, Root } from 'type-graphql'
import { MagicItem } from '@/models/2014/magicItem'
import MagicItemModel from '@/models/2014/magicItem'
import { EquipmentCategory } from '@/models/2014/equipmentCategory'
import EquipmentCategoryModel from '@/models/2014/equipmentCategory'
import { BaseResolver } from '@/graphql/common/resolvers/BaseResolver'
import { NameSortArgs } from '@/graphql/common/args/NameSortArgs'

@Resolver(MagicItem)
export class MagicItemResolver extends BaseResolver<MagicItem> {
  constructor() {
    super(MagicItemModel, MagicItem)
  }

  @Query(() => MagicItem, {
    nullable: true,
    description: 'Gets a single magic item by index (e.g., bag-of-holding).'
  })
  async magicItem(@Arg('index', () => String) index: string): Promise<MagicItem | null> {
    return this._findOneByIndex(index)
  }

  @Query(() => [MagicItem], {
    description: 'Gets all magic items, optionally filtered and sorted.'
  })
  async magicItems(@Args(() => NameSortArgs) args: NameSortArgs): Promise<MagicItem[]> {
    return this._find(args)
  }

  @FieldResolver(() => EquipmentCategory, { description: 'The category the item belongs to.' })
  async equipment_category(@Root() magicItem: MagicItem): Promise<EquipmentCategory | null> {
    if (!magicItem.equipment_category?.index) {
      return null
    }
    return EquipmentCategoryModel.findOne({ index: magicItem.equipment_category.index }).lean()
  }

  @FieldResolver(() => [MagicItem], {
    description: 'Other magic items that are variants of this item.',
    nullable: 'itemsAndList' // Allow list to be null/empty and items to be null
  })
  async variants(@Root() magicItem: MagicItem): Promise<Array<MagicItem | null> | null> {
    const variantIndices = magicItem.variants?.map((ref) => ref.index)
    if (!variantIndices || variantIndices.length === 0) {
      return null // Return null if no variant indices
    }

    const variants = await MagicItemModel.find({ index: { $in: variantIndices } }).lean()

    // Map results back to ensure order and handle cases where a variant index might not be found
    const variantsMap = new Map(variants.map((v) => [v.index, v]))
    return variantIndices.map((index) => variantsMap.get(index) || null)
  }
}
