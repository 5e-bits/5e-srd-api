import { ArgsType, Field, InputType, registerEnumType } from 'type-graphql'
import { z } from 'zod'

import {
  BaseIndexArgs,
  BaseIndexArgsSchema,
  BaseOrderInterface,
  BasePaginationArgs,
  BasePaginationArgsSchema
} from '@/graphql/common/args'
import { OrderByDirection } from '@/graphql/common/enums'
import { NumberFilterInput, NumberFilterInputSchema } from '@/graphql/common/inputs'

export enum LevelOrderField {
  LEVEL = 'level',
  CLASS = 'class',
  SUBCLASS = 'subclass'
}

export const LEVEL_SORT_FIELD_MAP: Record<LevelOrderField, string> = {
  [LevelOrderField.LEVEL]: 'level',
  [LevelOrderField.CLASS]: 'class.name',
  [LevelOrderField.SUBCLASS]: 'subclass.name'
}

registerEnumType(LevelOrderField, {
  name: 'Level2024OrderField',
  description: 'Fields to sort 2024 Levels by'
})

@InputType()
export class LevelOrder implements BaseOrderInterface<LevelOrderField> {
  @Field(() => LevelOrderField)
  by!: LevelOrderField

  @Field(() => OrderByDirection)
  direction!: OrderByDirection

  @Field(() => LevelOrder, { nullable: true })
  then_by?: LevelOrder
}

export const LevelOrderSchema: z.ZodType<LevelOrder> = z.lazy(() =>
  z.object({
    by: z.nativeEnum(LevelOrderField),
    direction: z.nativeEnum(OrderByDirection),
    then_by: LevelOrderSchema.optional()
  })
)

export const LevelArgsSchema = z.object({
  ...BasePaginationArgsSchema.shape,
  class: z.array(z.string()).optional(),
  subclass: z.array(z.string()).optional(),
  level: NumberFilterInputSchema.optional(),
  prof_bonus: NumberFilterInputSchema.optional(),
  order: LevelOrderSchema.optional()
})

export const LevelIndexArgsSchema = BaseIndexArgsSchema
export { BaseIndexArgs as LevelIndexArgs }

@ArgsType()
export class LevelArgs extends BasePaginationArgs {
  @Field(() => [String], { nullable: true, description: 'Filter by one or more class indices' })
  class?: string[]

  @Field(() => [String], { nullable: true, description: 'Filter by one or more subclass indices' })
  subclass?: string[]

  @Field(() => NumberFilterInput, {
    nullable: true,
    description: 'Filter by level. Allows exact match, list, or range.'
  })
  level?: NumberFilterInput

  @Field(() => NumberFilterInput, {
    nullable: true,
    description: 'Filter by proficiency bonus. Allows exact match, list, or range.'
  })
  prof_bonus?: NumberFilterInput

  @Field(() => LevelOrder, {
    nullable: true,
    description:
      'Specify sorting order for levels. Allows nested sorting. Defaults to LEVEL ascending.'
  })
  order?: LevelOrder
}
