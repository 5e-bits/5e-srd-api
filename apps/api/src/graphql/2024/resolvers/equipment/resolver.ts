import { FieldResolver, Resolver, Root } from 'type-graphql'

import { Tool } from '@/graphql/2024/common/equipmentTypes'
import { AnyEquipment } from '@/graphql/2024/common/unions'
import { createResolver } from '@/graphql/common/createResolver'
import { inFilter, regexFilter } from '@/graphql/common/filters'
import { resolveMultipleReferences, resolveSingleReference } from '@/graphql/utils/resolvers'
import AbilityScoreModel, { AbilityScore2024 } from '@/models/2024/abilityScore'
import EquipmentModel, { Content, Equipment2024 } from '@/models/2024/equipment'
import WeaponPropertyModel, { WeaponProperty2024 } from '@/models/2024/weaponProperty'
import { APIReference } from '@/models/common/apiReference'

import { EquipmentArgs, EquipmentArgsSchema } from './args'

@Resolver(Equipment2024)
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
  @FieldResolver(() => [WeaponProperty2024], { nullable: true })
  async properties(@Root() equipment: Equipment2024): Promise<WeaponProperty2024[] | null> {
    if (!equipment.properties) return null
    return resolveMultipleReferences(equipment.properties, WeaponPropertyModel)
  }

  @FieldResolver(() => Equipment2024, { nullable: true })
  async storage(@Root() equipment: Equipment2024): Promise<Equipment2024 | null> {
    if (!equipment.storage) return null
    return resolveSingleReference(equipment.storage, EquipmentModel)
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

@Resolver(() => Tool)
export class ToolResolver {
  @FieldResolver(() => AbilityScore2024, { nullable: true })
  async ability(@Root() tool: Tool): Promise<AbilityScore2024 | null> {
    if (!tool.ability) return null
    return resolveSingleReference(tool.ability, AbilityScoreModel)
  }

  @FieldResolver(() => [AnyEquipment], { nullable: true })
  async craft(@Root() tool: Tool): Promise<Array<typeof AnyEquipment> | null> {
    if (!tool.craft) return null
    return resolveMultipleReferences(tool.craft, EquipmentModel)
  }
}
