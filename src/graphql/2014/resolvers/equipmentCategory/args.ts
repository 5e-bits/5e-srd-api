import { ArgsType, Field, InputType, registerEnumType } from 'type-graphql'
import { z } from 'zod'

import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema,
  BaseOrderInterface
} from '@/graphql/common/args'
import { OrderByDirection } from '@/graphql/common/enums'

export enum EquipmentCategoryOrderField {
  NAME = 'name'
}

export const EQUIPMENT_CATEGORY_SORT_FIELD_MAP: Record<EquipmentCategoryOrderField, string> = {
  [EquipmentCategoryOrderField.NAME]: 'name'
}

registerEnumType(EquipmentCategoryOrderField, {
  name: 'EquipmentCategoryOrderField',
  description: 'Fields to sort Equipment Categories by'
})

@InputType()
export class EquipmentCategoryOrder implements BaseOrderInterface<EquipmentCategoryOrderField> {
  @Field(() => EquipmentCategoryOrderField)
  by!: EquipmentCategoryOrderField

  @Field(() => OrderByDirection)
  direction!: OrderByDirection

  @Field(() => EquipmentCategoryOrder, { nullable: true })
  then_by?: EquipmentCategoryOrder
}

export const EquipmentCategoryOrderSchema: z.ZodType<EquipmentCategoryOrder> = z.lazy(() =>
  z.object({
    by: z.nativeEnum(EquipmentCategoryOrderField),
    direction: z.nativeEnum(OrderByDirection),
    then_by: EquipmentCategoryOrderSchema.optional()
  })
)

export const EquipmentCategoryArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  order: EquipmentCategoryOrderSchema.optional()
})

export const EquipmentCategoryIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class EquipmentCategoryArgs extends BaseFilterArgs {
  @Field(() => EquipmentCategoryOrder, {
    nullable: true,
    description: 'Specify sorting order for equipment categories.'
  })
  order?: EquipmentCategoryOrder
}
