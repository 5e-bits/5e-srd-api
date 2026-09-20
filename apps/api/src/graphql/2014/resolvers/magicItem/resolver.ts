import { FieldResolver, Resolver, Root } from 'type-graphql'

import { createResolver } from '@/graphql/common/createResolver'
import { inFilter, regexFilter } from '@/graphql/common/filters'
import { resolveMultipleReferences, resolveSingleReference } from '@/graphql/utils/resolvers'
import EquipmentCategoryModel, { EquipmentCategory } from '@/models/2014/equipmentCategory'
import MagicItemModel, { MagicItem } from '@/models/2014/magicItem'

import { MagicItemArgs, MagicItemArgsSchema } from './args'

@Resolver(MagicItem)
export class MagicItemResolver extends createResolver({
  Type: MagicItem,
  Model: MagicItemModel,
  typeName: 'MagicItem',
  singular: 'magicItem',
  plural: 'magicItems',
  descriptions: {
    fields: 'Fields to sort Magic Items by',
    order: 'Specify sorting order for magic items.',
    list: 'Gets all magic items, optionally filtered and sorted.',
    single: 'Gets a single magic item by index.'
  },
  orderFields: {
    NAME: { value: 'name', path: 'name' },
    EQUIPMENT_CATEGORY: { value: 'equipment_category', path: 'equipment_category.name' },
    RARITY: { value: 'rarity', path: 'rarity.name' }
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
  @FieldResolver(() => EquipmentCategory, { nullable: true })
  async equipment_category(@Root() magicItem: MagicItem): Promise<EquipmentCategory | null> {
    return resolveSingleReference(magicItem.equipment_category, EquipmentCategoryModel)
  }

  @FieldResolver(() => [MagicItem], { nullable: true })
  async variants(@Root() magicItem: MagicItem): Promise<MagicItem[]> {
    return resolveMultipleReferences(magicItem.variants, MagicItemModel)
  }
}
