import { ArgsType, Field, InputType, registerEnumType } from 'type-graphql'
import { z } from 'zod'

import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema,
  BaseOrderInterface
} from '@/graphql/common/args'
import { OrderByDirection } from '@/graphql/common/enums'

export enum MagicItemOrderField {
  NAME = 'name',
  EQUIPMENT_CATEGORY = 'equipment_category',
  RARITY = 'rarity'
}

export const MAGIC_ITEM_SORT_FIELD_MAP: Record<MagicItemOrderField, string> = {
  [MagicItemOrderField.NAME]: 'name',
  [MagicItemOrderField.EQUIPMENT_CATEGORY]: 'equipment_category.name',
  [MagicItemOrderField.RARITY]: 'rarity.name'
}

registerEnumType(MagicItemOrderField, {
  name: 'MagicItemOrderField',
  description: 'Fields to sort Magic Items by'
})

@InputType()
export class MagicItemOrder implements BaseOrderInterface<MagicItemOrderField> {
  @Field(() => MagicItemOrderField)
  by!: MagicItemOrderField

  @Field(() => OrderByDirection)
  direction!: OrderByDirection

  @Field(() => MagicItemOrder, { nullable: true })
  then_by?: MagicItemOrder
}

export const MagicItemOrderSchema: z.ZodType<MagicItemOrder> = z.lazy(() =>
  z.object({
    by: z.nativeEnum(MagicItemOrderField),
    direction: z.nativeEnum(OrderByDirection),
    then_by: MagicItemOrderSchema.optional()
  })
)

export const MagicItemArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  equipment_category: z.array(z.string()).optional(),
  rarity: z.array(z.string()).optional(),
  order: MagicItemOrderSchema.optional()
})

export const MagicItemIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class MagicItemArgs extends BaseFilterArgs {
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

  @Field(() => MagicItemOrder, {
    nullable: true,
    description: 'Specify sorting order for magic items.'
  })
  order?: MagicItemOrder
}
