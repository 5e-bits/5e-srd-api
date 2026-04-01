import { Arg, Args, FieldResolver, Query, Resolver, Root } from 'type-graphql'

import { buildSortPipeline } from '@/graphql/common/args'
import { resolveSingleReference, resolveMultipleReferences } from '@/graphql/utils/resolvers'
import EquipmentCategoryModel, { EquipmentCategory2024 } from '@/models/2024/equipmentCategory'
import MagicItemModel, { MagicItem2024 } from '@/models/2024/magicItem'
import { escapeRegExp } from '@/util'

import {
  MAGIC_ITEM_SORT_FIELD_MAP,
  MagicItemArgs,
  MagicItemArgsSchema,
  MagicItemIndexArgsSchema,
  MagicItemOrderField
} from './args'

@Resolver(MagicItem2024)
export class MagicItemResolver {
  @Query(() => [MagicItem2024], {
    description: 'Gets all magic items, optionally filtered by name, equipment category, or rarity.'
  })
  async magicItems(@Args(() => MagicItemArgs) args: MagicItemArgs): Promise<MagicItem2024[]> {
    const validatedArgs = MagicItemArgsSchema.parse(args)
    const query = MagicItemModel.find()
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
      query.where({ $and: filters })
    }

    const sortQuery = buildSortPipeline<MagicItemOrderField>({
      order: validatedArgs.order,
      sortFieldMap: MAGIC_ITEM_SORT_FIELD_MAP,
      defaultSortField: MagicItemOrderField.NAME
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

  @Query(() => MagicItem2024, {
    nullable: true,
    description: 'Gets a single magic item by index.'
  })
  async magicItem(@Arg('index', () => String) indexInput: string): Promise<MagicItem2024 | null> {
    const { index } = MagicItemIndexArgsSchema.parse({ index: indexInput })
    return MagicItemModel.findOne({ index }).lean()
  }

  @FieldResolver(() => EquipmentCategory2024)
  async equipment_category(@Root() magicItem: MagicItem2024): Promise<EquipmentCategory2024 | null> {
    return resolveSingleReference(magicItem.equipment_category, EquipmentCategoryModel)
  }

  @FieldResolver(() => [MagicItem2024])
  async variants(@Root() magicItem: MagicItem2024): Promise<MagicItem2024[]> {
    return resolveMultipleReferences(magicItem.variants, MagicItemModel)
  }
}
