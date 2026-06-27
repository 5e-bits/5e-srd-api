import { ArgsType, Field, InputType, registerEnumType } from 'type-graphql'
import { z } from 'zod'

import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgs,
  BaseIndexArgsSchema,
  BaseOrderInterface
} from '@/graphql/common/args'
import { OrderByDirection } from '@/graphql/common/enums'
import { NumberFilterInput, NumberFilterInputSchema } from '@/graphql/common/inputs'

export enum PoisonOrderField {
  NAME = 'name',
  COST = 'cost',
  TYPE = 'type'
}

export const POISON_SORT_FIELD_MAP: Record<PoisonOrderField, string> = {
  [PoisonOrderField.NAME]: 'name',
  [PoisonOrderField.COST]: 'cost',
  [PoisonOrderField.TYPE]: 'type'
}

registerEnumType(PoisonOrderField, {
  name: 'Poison2024OrderField',
  description: 'Fields to sort 2024 Poisons by'
})

@InputType()
export class PoisonOrder implements BaseOrderInterface<PoisonOrderField> {
  @Field(() => PoisonOrderField)
  by!: PoisonOrderField

  @Field(() => OrderByDirection)
  direction!: OrderByDirection

  @Field(() => PoisonOrder, { nullable: true })
  then_by?: PoisonOrder
}

export const PoisonOrderSchema: z.ZodType<PoisonOrder> = z.lazy(() =>
  z.object({
    by: z.nativeEnum(PoisonOrderField),
    direction: z.nativeEnum(OrderByDirection),
    then_by: PoisonOrderSchema.optional()
  })
)

export const PoisonArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  cost: NumberFilterInputSchema.optional(),
  type: z.array(z.string()).optional(),
  order: PoisonOrderSchema.optional()
})

export const PoisonIndexArgsSchema = BaseIndexArgsSchema
export { BaseIndexArgs as PoisonIndexArgs }

@ArgsType()
export class PoisonArgs extends BaseFilterArgs {
  @Field(() => NumberFilterInput, {
    nullable: true,
    description: 'Filter by cost. Allows exact match, list, or range.'
  })
  cost?: NumberFilterInput

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by one or more poison delivery types.'
  })
  type?: string[]

  @Field(() => PoisonOrder, {
    nullable: true,
    description: 'Specify sorting order for 2024 poisons.'
  })
  order?: PoisonOrder
}
