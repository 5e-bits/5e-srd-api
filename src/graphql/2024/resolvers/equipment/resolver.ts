import { Arg, Args, FieldResolver, Query, Resolver, Root } from 'type-graphql'

import { AnyEquipment } from '@/graphql/2024/common/unions'
import { buildSortPipeline } from '@/graphql/common/args'
import { resolveMultipleReferences } from '@/graphql/utils/resolvers'
import EquipmentModel, { Equipment2024 } from '@/models/2024/equipment'
import WeaponPropertyModel, { WeaponProperty2024 } from '@/models/2024/weaponProperty'
import { escapeRegExp } from '@/util'

import {
  EQUIPMENT_SORT_FIELD_MAP,
  EquipmentArgs,
  EquipmentArgsSchema,
  EquipmentIndexArgsSchema,
  EquipmentOrderField
} from './args'

@Resolver(Equipment2024)
export class EquipmentResolver {
  @Query(() => [AnyEquipment], {
    description: 'Gets all equipment, optionally filtered and sorted.'
  })
  async equipments(
    @Args(() => EquipmentArgs) args: EquipmentArgs
  ): Promise<Array<typeof AnyEquipment>> {
    const validatedArgs = EquipmentArgsSchema.parse(args)
    const query = EquipmentModel.find()
    const filters: any[] = []

    if (validatedArgs.name != null && validatedArgs.name !== '') {
      filters.push({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    if (validatedArgs.equipment_category && validatedArgs.equipment_category.length > 0) {
      filters.push({ 'equipment_category.index': { $in: validatedArgs.equipment_category } })
    }

    if (filters.length > 0) {
      query.where({ $and: filters })
    }

    const sortQuery = buildSortPipeline<EquipmentOrderField>({
      order: validatedArgs.order,
      sortFieldMap: EQUIPMENT_SORT_FIELD_MAP,
      defaultSortField: EquipmentOrderField.NAME
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

  @FieldResolver(() => [WeaponProperty2024], { nullable: true })
  async properties(@Root() equipment: Equipment2024): Promise<WeaponProperty2024[] | null> {
    if (!equipment.properties) return null
    return resolveMultipleReferences(equipment.properties, WeaponPropertyModel)
  }
}
