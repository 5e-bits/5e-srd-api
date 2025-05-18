import {
  Resolver,
  Query,
  Arg,
  Args,
  ArgsType,
  Field,
  FieldResolver,
  Root,
  registerEnumType,
  Int
} from 'type-graphql'
import { z } from 'zod'
import MagicItemModel, { MagicItem } from '@/models/2014/magicItem'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { escapeRegExp } from '@/util'
import EquipmentCategoryModel, { EquipmentCategory } from '@/models/2014/equipmentCategory'
import {
  resolveSingleReference,
  resolveMultipleReferences
} from '@/graphql/2014rewrite/utils/resolvers'
import { buildMongoSortQuery } from '@/graphql/2014rewrite/common/inputs'

export enum MagicItemOrderField {
  NAME = 'name',
  EQUIPMENT_CATEGORY = 'equipment_category',
  RARITY = 'rarity'
}

registerEnumType(MagicItemOrderField, {
  name: 'MagicItemOrderField',
  description: 'Fields to sort Magic Items by'
})

const MAGIC_ITEM_SORT_FIELD_MAP: Record<MagicItemOrderField, string> = {
  [MagicItemOrderField.NAME]: 'name',
  [MagicItemOrderField.EQUIPMENT_CATEGORY]: 'equipment_category.name',
  [MagicItemOrderField.RARITY]: 'rarity.name'
}

const MagicItemArgsSchema = z.object({
  name: z.string().optional(),
  equipment_category: z.array(z.string()).optional(),
  rarity: z.array(z.string()).optional(),
  order_by: z.nativeEnum(MagicItemOrderField).optional(),
  order_direction: z.nativeEnum(OrderByDirection).optional().default(OrderByDirection.ASC),
  skip: z.number().int().min(0).optional(),
  limit: z.number().int().min(1).optional()
})

const MagicItemIndexArgsSchema = z.object({
  index: z.string().min(1, { message: 'Index must be a non-empty string' })
})

@ArgsType()
class MagicItemArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by magic item name (case-insensitive, partial match)'
  })
  name?: string

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by one or more equipment category indices (e.g., ["armor", "weapon"])'
  })
  equipment_category?: string[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by one or more rarity names (e.g., ["Rare", "Legendary"])'
  })
  rarity?: string[]

  @Field(() => MagicItemOrderField, {
    nullable: true,
    description: 'Field to sort magic items by.'
  })
  order_by?: MagicItemOrderField

  @Field(() => OrderByDirection, {
    nullable: true,
    description: 'Sort direction (default: ASC)'
  })
  order_direction?: OrderByDirection

  @Field(() => Int, { nullable: true, description: 'TODO: Pass 5 - Number of results to skip' })
  skip?: number

  @Field(() => Int, {
    nullable: true,
    description: 'TODO: Pass 5 - Maximum number of results to return'
  })
  limit?: number
}

@Resolver(MagicItem)
export class MagicItemResolver {
  @Query(() => [MagicItem], {
    description: 'Gets all magic items, optionally filtered and sorted.'
  })
  async magicItems(@Args() args: MagicItemArgs): Promise<MagicItem[]> {
    const validatedArgs = MagicItemArgsSchema.parse(args)

    let query = MagicItemModel.find()
    const filters: any[] = []

    if (validatedArgs.name) {
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

    const sortQuery = buildMongoSortQuery({
      orderBy: validatedArgs.order_by,
      orderDirection: validatedArgs.order_direction,
      sortFieldMap: MAGIC_ITEM_SORT_FIELD_MAP,
      defaultSortField: MagicItemOrderField.NAME
    })

    if (sortQuery) {
      query = query.sort(sortQuery)
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
