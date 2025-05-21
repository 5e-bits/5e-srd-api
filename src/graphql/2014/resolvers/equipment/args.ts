import { ArgsType, Field, registerEnumType } from 'type-graphql'
import { z } from 'zod'
import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema
} from '@/graphql/2014/common/args'

export enum EquipmentOrderField {
  NAME = 'name',
  WEIGHT = 'weight',
  COST_QUANTITY = 'cost_quantity'
}

registerEnumType(EquipmentOrderField, {
  name: 'EquipmentOrderField',
  description: 'Fields to sort Equipment by'
})

export const EQUIPMENT_SORT_FIELD_MAP: Record<EquipmentOrderField, string> = {
  [EquipmentOrderField.NAME]: 'name',
  [EquipmentOrderField.WEIGHT]: 'weight',
  [EquipmentOrderField.COST_QUANTITY]: 'cost.quantity'
}

export const EquipmentArgsSchema = BaseFilterArgsSchema.extend({
  equipment_category: z.array(z.string()).optional(),
  order_by: z.nativeEnum(EquipmentOrderField).optional()
})

export const EquipmentIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class EquipmentArgs extends BaseFilterArgs {
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
}
