import { ArgsType, Field, InputType, Int, registerEnumType } from 'type-graphql'
import { z } from 'zod'

import {
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
  name: 'LevelOrderField',
  description: 'Fields to sort Levels by'
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
  ability_score_bonuses: z.number().int().optional(),
  prof_bonus: z.number().int().optional(),
  order: LevelOrderSchema.optional()
})

export const LevelIndexArgsSchema = BaseIndexArgsSchema

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

  @Field(() => Int, {
    nullable: true,
    description: 'Filter by the exact number of ability score bonuses granted at this level.'
  })
  ability_score_bonuses?: number

  @Field(() => Int, {
    nullable: true,
    description: 'Filter by the exact proficiency bonus at this level.'
  })
  prof_bonus?: number

  @Field(() => LevelOrder, {
    nullable: true,
    description:
      'Specify sorting order for levels. Allows nested sorting. Defaults to LEVEL ascending.'
  })
  order?: LevelOrder
}
