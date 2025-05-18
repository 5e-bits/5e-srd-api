import { Resolver, Query, Arg, Args, ArgsType, Field, FieldResolver, Root, Int } from 'type-graphql'
import { z } from 'zod'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { escapeRegExp } from '@/util'
import EquipmentModel, { Equipment } from '@/models/2014/equipment'
import EquipmentCategoryModel, { EquipmentCategory } from '@/models/2014/equipmentCategory'
import MagicItemModel, { MagicItem } from '@/models/2014/magicItem'
import { EquipmentOrMagicItem } from '@/graphql/2014rewrite/common/unions'
import { buildMongoSortQuery } from '../common/inputs'

// Zod schema for EquipmentCategoryArgs
const EquipmentCategoryArgsSchema = z.object({
  name: z.string().optional(),
  order_direction: z.nativeEnum(OrderByDirection).optional().default(OrderByDirection.ASC),
  skip: z.number().int().min(0).optional(),
  limit: z.number().int().min(1).optional()
})

// Zod schema for EquipmentCategory index argument
const EquipmentCategoryIndexArgsSchema = z.object({
  index: z.string().min(1, { message: 'Index must be a non-empty string' })
})

@ArgsType()
class EquipmentCategoryArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by category name (case-insensitive, partial match)'
  })
  name?: string

  @Field(() => OrderByDirection, {
    nullable: true,
    description: 'Sort direction (default: ASC for name)'
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

@Resolver(EquipmentCategory)
export class EquipmentCategoryResolver {
  @Query(() => [EquipmentCategory], {
    description: 'Gets all equipment categories, optionally filtered by name and sorted by name.'
  })
  async equipmentCategories(@Args() args: EquipmentCategoryArgs): Promise<EquipmentCategory[]> {
    const validatedArgs = EquipmentCategoryArgsSchema.parse(args)
    const query = EquipmentCategoryModel.find()

    if (validatedArgs.name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    const sortQuery = buildMongoSortQuery({
      defaultSortField: 'name',
      orderDirection: validatedArgs.order_direction
    })
    if (sortQuery) {
      query.sort(sortQuery)
    }

    // TODO: Pass 5 - Implement pagination
    // if (skip) query.skip(skip);
    // if (limit) query.limit(limit);
    return query.lean()
  }

  @Query(() => EquipmentCategory, {
    nullable: true,
    description: 'Gets a single equipment category by index.'
  })
  async equipmentCategory(
    @Arg('index', () => String) indexInput: string
  ): Promise<EquipmentCategory | null> {
    const { index } = EquipmentCategoryIndexArgsSchema.parse({ index: indexInput })
    return EquipmentCategoryModel.findOne({ index }).lean()
  }

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
