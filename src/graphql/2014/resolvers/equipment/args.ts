import { ArgsType, Field, InputType, registerEnumType } from 'type-graphql'
import { z } from 'zod'

import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema,
  BaseOrderInterface
} from '@/graphql/2014/common/args'
import { OrderByDirection } from '@/graphql/2014/common/enums'

export enum EquipmentOrderField {
  NAME = 'name',
  WEIGHT = 'weight',
  COST_QUANTITY = 'cost_quantity'
}

export const EQUIPMENT_SORT_FIELD_MAP: Record<EquipmentOrderField, string> = {
  [EquipmentOrderField.NAME]: 'name',
  [EquipmentOrderField.WEIGHT]: 'weight',
  [EquipmentOrderField.COST_QUANTITY]: 'cost.quantity'
}

registerEnumType(EquipmentOrderField, {
  name: 'EquipmentOrderField',
  description: 'Fields to sort Equipment by'
})

@InputType()
export class EquipmentOrder implements BaseOrderInterface<EquipmentOrderField> {
  @Field(() => EquipmentOrderField)
  by!: EquipmentOrderField

  @Field(() => OrderByDirection)
  direction!: OrderByDirection

  @Field(() => EquipmentOrder, { nullable: true })
  then_by?: EquipmentOrder
}

export const EquipmentOrderSchema: z.ZodType<EquipmentOrder> = z.lazy(() =>
  z.object({
    by: z.nativeEnum(EquipmentOrderField),
    direction: z.nativeEnum(OrderByDirection),
    then_by: EquipmentOrderSchema.optional() // Simplified
  })
)

export const EquipmentArgsSchema = BaseFilterArgsSchema.extend({
  equipment_category: z.array(z.string()).optional(),
  order: EquipmentOrderSchema.optional()
})

export const EquipmentIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class EquipmentArgs extends BaseFilterArgs {
  @Field(() => [String], {
    nullable: true,
    description: 'Filter by one or more equipment category indices (e.g., ["weapon", "armor"])'
  })
  equipment_category?: string[]

  @Field(() => EquipmentOrder, {
    nullable: true,
    description: 'Specify sorting order for equipment.'
  })
  order?: EquipmentOrder
}
