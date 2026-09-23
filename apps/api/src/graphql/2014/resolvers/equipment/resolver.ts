import { FieldResolver, Resolver, Root } from 'type-graphql'

import { AnyEquipment } from '@/graphql/2014/common/unions'
import { createResolver } from '@/graphql/common/createResolver'
import { inFilter, regexFilter } from '@/graphql/common/filters'
import { resolveMultipleReferences, resolveSingleReference } from '@/graphql/utils/resolvers'
import EquipmentModel, { Content, Equipment } from '@/models/2014/equipment'
import WeaponPropertyModel, { WeaponProperty } from '@/models/2014/weaponProperty'
import { APIReference } from '@/models/common/apiReference'

import { EquipmentArgs, EquipmentArgsSchema } from './args'

@Resolver(Equipment)
export class EquipmentResolver extends createResolver({
  Type: AnyEquipment,
  Model: EquipmentModel,
  typeName: 'Equipment',
  singular: 'equipment',
  plural: 'equipments',
  descriptions: {
    fields: 'Fields to sort Equipment by',
    order: 'Specify sorting order for equipment.',
    list: 'Gets all equipment, optionally filtered and sorted.',
    single: 'Gets a single piece of equipment by its index.'
  },
  orderFields: {
    NAME: { value: 'name', path: 'name' },
    WEIGHT: { value: 'weight', path: 'weight' },
    COST_QUANTITY: { value: 'cost_quantity', path: 'cost.quantity' }
  },
  defaultSort: 'NAME',
  Args: EquipmentArgs,
  argsSchema: EquipmentArgsSchema,
  filters: (a) => [
    regexFilter('name', a.name),
    inFilter('equipment_categories.index', a.equipment_category)
  ]
}) {
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
