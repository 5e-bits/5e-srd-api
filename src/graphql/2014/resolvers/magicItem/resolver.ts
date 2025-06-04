import { Arg, Args, FieldResolver, Query, Resolver, Root } from 'type-graphql'

import { buildSortPipeline } from '@/graphql/common/args'
import { resolveMultipleReferences, resolveSingleReference } from '@/graphql/utils/resolvers'
import EquipmentCategoryModel, { EquipmentCategory } from '@/models/2014/equipmentCategory'
import MagicItemModel, { MagicItem } from '@/models/2014/magicItem'
import { escapeRegExp } from '@/util'

import {
  MAGIC_ITEM_SORT_FIELD_MAP,
  MagicItemArgs,
  MagicItemArgsSchema,
  MagicItemIndexArgsSchema,
  MagicItemOrderField
} from './args'

@Resolver(MagicItem)
export class MagicItemResolver {
  @Query(() => [MagicItem], {
    description: 'Gets all magic items, optionally filtered and sorted.'
  })
  async magicItems(@Args(() => MagicItemArgs) args: MagicItemArgs): Promise<MagicItem[]> {
    const validatedArgs = MagicItemArgsSchema.parse(args)

    let query = MagicItemModel.find()
    const filters: any[] = []

    if (validatedArgs.name != null && validatedArgs.name !== '') {
      filters.push({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    if (validatedArgs.equipment_category && validatedArgs.equipment_category.length > 0) {
      filters.push({ 'equipment_category.index': { $in: validatedArgs.equipment_category } })
    }

    if (validatedArgs.rarity && validatedArgs.rarity.length > 0) {
      filters.push({ 'rarity.name': { $in: validatedArgs.rarity } })
    }

    if (filters.length > 0) {
      query = query.where({ $and: filters })
    }

    const sortQuery = buildSortPipeline<MagicItemOrderField>({
      order: validatedArgs.order,
      sortFieldMap: MAGIC_ITEM_SORT_FIELD_MAP,
      defaultSortField: MagicItemOrderField.NAME
    })

    if (Object.keys(sortQuery).length > 0) {
      query = query.sort(sortQuery)
    }

    if (validatedArgs.skip !== undefined) {
      query = query.skip(validatedArgs.skip)
    }
    if (validatedArgs.limit !== undefined) {
      query = query.limit(validatedArgs.limit)
    }

    return query.lean()
  }

  @Query(() => MagicItem, { nullable: true, description: 'Gets a single magic item by index.' })
  async magicItem(@Arg('index', () => String) indexInput: string): Promise<MagicItem | null> {
    const { index } = MagicItemIndexArgsSchema.parse({ index: indexInput })
    return MagicItemModel.findOne({ index }).lean()
  }

  @FieldResolver(() => EquipmentCategory, { nullable: true })
  async equipment_category(@Root() magicItem: MagicItem): Promise<EquipmentCategory | null> {
    return resolveSingleReference(magicItem.equipment_category, EquipmentCategoryModel)
  }

  @FieldResolver(() => [MagicItem], { nullable: true })
  async variants(@Root() magicItem: MagicItem): Promise<MagicItem[]> {
    return resolveMultipleReferences(magicItem.variants, MagicItemModel)
  }
}
