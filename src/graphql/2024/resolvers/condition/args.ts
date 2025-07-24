import { ArgsType, Field, InputType, registerEnumType } from 'type-graphql'
import { z } from 'zod'

import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema,
  BaseOrderInterface
} from '@/graphql/common/args'
import { OrderByDirection } from '@/graphql/common/enums'

export enum ConditionOrderField {
  NAME = 'name'
}

export const CONDITION_SORT_FIELD_MAP: Record<ConditionOrderField, string> = {
  [ConditionOrderField.NAME]: 'name'
}

registerEnumType(ConditionOrderField, {
  name: 'ConditionOrderField',
  description: 'Fields to sort Conditions by'
})

@InputType()
export class ConditionOrder implements BaseOrderInterface<ConditionOrderField> {
  @Field(() => ConditionOrderField)
  by!: ConditionOrderField

  @Field(() => OrderByDirection)
  direction!: OrderByDirection

  @Field(() => ConditionOrder, { nullable: true })
  then_by?: ConditionOrder
}

export const ConditionOrderSchema: z.ZodType<ConditionOrder> = z.lazy(() =>
  z.object({
    by: z.nativeEnum(ConditionOrderField),
    direction: z.nativeEnum(OrderByDirection),
    then_by: ConditionOrderSchema.optional()
  })
)

export const ConditionArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  order: ConditionOrderSchema.optional()
})

export const ConditionIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class ConditionArgs extends BaseFilterArgs {
  @Field(() => ConditionOrder, {
    nullable: true,
    description: 'Specify sorting order for conditions.'
  })
  order?: ConditionOrder
}
