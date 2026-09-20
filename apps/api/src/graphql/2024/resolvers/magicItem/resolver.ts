import { FieldResolver, Resolver, Root } from 'type-graphql'

import { createResolver } from '@/graphql/common/createResolver'
import { inFilter, regexFilter } from '@/graphql/common/filters'
import { resolveSingleReference, resolveMultipleReferences } from '@/graphql/utils/resolvers'
import EquipmentCategoryModel, { EquipmentCategory2024 } from '@/models/2024/equipmentCategory'
import MagicItemModel, { MagicItem2024 } from '@/models/2024/magicItem'

import { MagicItemArgs, MagicItemArgsSchema } from './args'

@Resolver(MagicItem2024)
export class MagicItemResolver extends createResolver({
  Type: MagicItem2024,
  Model: MagicItemModel,
  typeName: 'MagicItem',
  singular: 'magicItem',
  plural: 'magicItems',
  descriptions: {
    fields: 'Fields to sort Magic Items by',
    order: 'Specify sorting order for magic items.',
    list: 'Gets all magic items, optionally filtered by name, equipment category, or rarity.',
    single: 'Gets a single magic item by index.'
  },
  orderFields: {
    NAME: { value: 'name', path: 'name' }
  },
  defaultSort: 'NAME',
  Args: MagicItemArgs,
  argsSchema: MagicItemArgsSchema,
  filters: (a) => [
    regexFilter('name', a.name),
    inFilter('equipment_category.index', a.equipment_category),
    inFilter('rarity.name', a.rarity)
  ]
}) {
  @FieldResolver(() => EquipmentCategory2024)
  async equipment_category(
    @Root() magicItem: MagicItem2024
  ): Promise<EquipmentCategory2024 | null> {
    return resolveSingleReference(magicItem.equipment_category, EquipmentCategoryModel)
  }

  @FieldResolver(() => [MagicItem2024])
  async variants(@Root() magicItem: MagicItem2024): Promise<MagicItem2024[]> {
    return resolveMultipleReferences(magicItem.variants, MagicItemModel)
  }
}
