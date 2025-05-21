import { ArgsType, Field, registerEnumType } from 'type-graphql'
import { z } from 'zod'
import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema
} from '@/graphql/2014/common/args'

export enum MagicItemOrderField {
  NAME = 'name',
  EQUIPMENT_CATEGORY = 'equipment_category',
  RARITY = 'rarity'
}

registerEnumType(MagicItemOrderField, {
  name: 'MagicItemOrderField',
  description: 'Fields to sort Magic Items by'
})

export const MAGIC_ITEM_SORT_FIELD_MAP: Record<MagicItemOrderField, string> = {
  [MagicItemOrderField.NAME]: 'name',
  [MagicItemOrderField.EQUIPMENT_CATEGORY]: 'equipment_category.name',
  [MagicItemOrderField.RARITY]: 'rarity.name'
}

export const MagicItemArgsSchema = BaseFilterArgsSchema.extend({
  equipment_category: z.array(z.string()).optional(),
  rarity: z.array(z.string()).optional(),
  order_by: z.nativeEnum(MagicItemOrderField).optional()
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

  @Field(() => MagicItemOrderField, {
    nullable: true,
    description: 'Field to sort magic items by.'
  })
  order_by?: MagicItemOrderField
}
