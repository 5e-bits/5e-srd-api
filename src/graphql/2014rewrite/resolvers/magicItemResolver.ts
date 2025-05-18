import {
  Resolver,
  Query,
  Arg,
  Args,
  ArgsType,
  Field,
  FieldResolver,
  Root,
  registerEnumType
} from 'type-graphql'
import MagicItemModel, { MagicItem } from '@/models/2014/magicItem'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { IsOptional, IsString, IsEnum, IsArray } from 'class-validator'
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

@ArgsType()
class MagicItemArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by magic item name (case-insensitive, partial match)'
  })
  @IsOptional()
  @IsString()
  name?: string

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by one or more equipment category indices (e.g., ["armor", "weapon"])'
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  equipment_category?: string[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by one or more rarity names (e.g., ["Rare", "Legendary"])'
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  rarity?: string[]

  @Field(() => MagicItemOrderField, {
    nullable: true,
    description: 'Field to sort magic items by.'
  })
  @IsOptional()
  @IsEnum(MagicItemOrderField)
  order_by?: MagicItemOrderField

  @Field(() => OrderByDirection, {
    nullable: true,
    defaultValue: OrderByDirection.ASC,
    description: 'Sort direction (default: ASC)'
  })
  @IsOptional()
  @IsEnum(OrderByDirection)
  order_direction?: OrderByDirection
}

@Resolver(MagicItem)
export class MagicItemResolver {
  @Query(() => [MagicItem], {
    description: 'Gets all magic items, optionally filtered and sorted.'
  })
  async magicItems(
    @Args() { name, equipment_category, rarity, order_by, order_direction }: MagicItemArgs
  ): Promise<MagicItem[]> {
    let query = MagicItemModel.find()
    const filters: any[] = []

    if (name) {
      filters.push({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
    }

    if (equipment_category && equipment_category.length > 0) {
      filters.push({ 'equipment_category.index': { $in: equipment_category } })
    }

    if (rarity && rarity.length > 0) {
      filters.push({ 'rarity.name': { $in: rarity } })
    }

    if (filters.length > 0) {
      query = query.where({ $and: filters })
    }

    const sortQuery = buildMongoSortQuery({
      orderBy: order_by,
      orderDirection: order_direction,
      sortFieldMap: MAGIC_ITEM_SORT_FIELD_MAP,
      defaultSortField: 'name'
    })

    if (sortQuery) {
      query = query.sort(sortQuery)
    }

    return query.lean()
  }

  @Query(() => MagicItem, { nullable: true, description: 'Gets a single magic item by index.' })
  async magicItem(@Arg('index', () => String) index: string): Promise<MagicItem | null> {
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
