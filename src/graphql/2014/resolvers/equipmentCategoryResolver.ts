import { EquipmentCategory } from '@/models/2014/equipmentCategory'
import { Resolver, Query, Arg, Args } from 'type-graphql'
import EquipmentCategoryModel from '@/models/2014/equipmentCategory'
import { BaseResolver } from '@/graphql/common/resolvers/BaseResolver'
import { NameSortArgs } from '@/graphql/common/args/NameSortArgs'

@Resolver(EquipmentCategory)
export class EquipmentCategoryResolver extends BaseResolver<EquipmentCategory> {
  constructor() {
    super(EquipmentCategoryModel, EquipmentCategory)
  }

  @Query(() => EquipmentCategory, {
    nullable: true,
    description: 'Gets a single equipment category by index (e.g., heavy-armor).'
  })
  async equipmentCategory(
    @Arg('index', () => String) index: string
  ): Promise<EquipmentCategory | null> {
    return this._findOneByIndex(index)
  }

  @Query(() => [EquipmentCategory], {
    description: 'Gets all equipment categories, optionally filtered and sorted.'
  })
  async equipmentCategories(
    @Args(() => NameSortArgs) args: NameSortArgs
  ): Promise<EquipmentCategory[]> {
    return this._find(args)
  }

  // FieldResolver for 'equipment' will be added later when Equipment model is migrated.
  // Removing old equipment resolver function left from previous structure:
  /*
    equipment: async (equipmentCategory: EquipmentCategory, args: Args) => {
      const indexes = equipmentCategory.equipment.map((e) => e.index)
      ...
    }
  */
}

export default EquipmentCategoryResolver
