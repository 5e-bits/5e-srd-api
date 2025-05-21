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
import { z } from 'zod'
import EquipmentModel, { Equipment, Content } from '@/models/2014/equipment'
import { OrderByDirection } from '@/graphql/2014/common/enums'
import { escapeRegExp } from '@/util'
import WeaponPropertyModel, { WeaponProperty } from '@/models/2014/weaponProperty'
import { resolveMultipleReferences, resolveSingleReference } from '@/graphql/2014/utils/resolvers'
import { APIReference } from '@/models/2014/types/apiReference'
import { AnyEquipment } from '@/graphql/2014/common/unions'
import { buildMongoSortQuery } from '../common/inputs'
import { BasePaginationArgs, BasePaginationArgsSchema } from '../common/args'

export enum EquipmentOrderField {
  NAME = 'name',
  WEIGHT = 'weight',
  COST_QUANTITY = 'cost_quantity'
}

registerEnumType(EquipmentOrderField, {
  name: 'EquipmentOrderField',
  description: 'Fields to sort Equipment by'
})

const EQUIPMENT_SORT_FIELD_MAP: Record<EquipmentOrderField, string> = {
  [EquipmentOrderField.NAME]: 'name',
  [EquipmentOrderField.WEIGHT]: 'weight',
  [EquipmentOrderField.COST_QUANTITY]: 'cost.quantity'
}

const EquipmentArgsSchema = z
  .object({
    name: z.string().optional(),
    equipment_category: z.array(z.string()).optional(),
    order_by: z.nativeEnum(EquipmentOrderField).optional(),
    order_direction: z.nativeEnum(OrderByDirection).optional().default(OrderByDirection.ASC)
  })
  .merge(BasePaginationArgsSchema)

const EquipmentIndexArgsSchema = z.object({
  index: z.string().min(1, { message: 'Index must be a non-empty string' })
})

@ArgsType()
class EquipmentArgs extends BasePaginationArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by equipment name (case-insensitive, partial match)'
  })
  name?: string

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by one or more equipment category indices (e.g., ["weapon", "armor"])'
  })
  equipment_category?: string[]

  @Field(() => EquipmentOrderField, {
    nullable: true,
    description: 'Field to sort equipment by.'
  })
  order_by?: EquipmentOrderField

  @Field(() => OrderByDirection, {
    nullable: true,
    description: 'Sort direction for the chosen field'
  })
  order_direction?: OrderByDirection
}

@Resolver(Equipment)
export class EquipmentResolver {
  @Query(() => [AnyEquipment], {
    description: 'Gets all equipment, optionally filtered and sorted.'
  })
  async equipments(@Args() args: EquipmentArgs): Promise<Array<typeof AnyEquipment>> {
    const validatedArgs = EquipmentArgsSchema.parse(args)
    const query = EquipmentModel.find()
    const filters: any[] = []

    if (validatedArgs.name) {
      filters.push({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    if (validatedArgs.equipment_category && validatedArgs.equipment_category.length > 0) {
      filters.push({ 'equipment_category.index': { $in: validatedArgs.equipment_category } })
    }

    if (filters.length > 0) {
      query.where({ $and: filters })
    }

    const sortQuery = buildMongoSortQuery({
      orderBy: validatedArgs.order_by,
      orderDirection: validatedArgs.order_direction,
      sortFieldMap: EQUIPMENT_SORT_FIELD_MAP,
      defaultSortField: EquipmentOrderField.NAME
    })
    if (sortQuery) {
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

  @Query(() => AnyEquipment, {
    nullable: true,
    description: 'Gets a single piece of equipment by its index.'
  })
  async equipment(
    @Arg('index', () => String) indexInput: string
  ): Promise<typeof AnyEquipment | null> {
    const { index } = EquipmentIndexArgsSchema.parse({ index: indexInput })
    return EquipmentModel.findOne({ index }).lean()
  }

  @FieldResolver(() => [WeaponProperty], { nullable: true })
  async properties(@Root() equipment: Equipment): Promise<WeaponProperty[] | null> {
    if (!equipment.properties) return null
    return resolveMultipleReferences(equipment.properties, WeaponPropertyModel)
  }
}
@Resolver(Content)
export class ContentFieldResolver {
  @FieldResolver(() => AnyEquipment, {
    nullable: true,
    description: 'Resolves the APIReference to the actual Equipment.'
  })
  async item(@Root() content: Content): Promise<typeof AnyEquipment | null> {
    const itemRef: APIReference = content.item

    if (!itemRef?.index) return null

    return resolveSingleReference(itemRef, EquipmentModel)
  }
}
