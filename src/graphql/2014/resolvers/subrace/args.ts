import { ArgsType, Field, InputType, registerEnumType } from 'type-graphql'
import { z } from 'zod'

import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema,
  BaseOrderInterface
} from '@/graphql/common/args'
import { OrderByDirection } from '@/graphql/common/enums'

export enum SubraceOrderField {
  NAME = 'name'
}

export const SUBRACE_SORT_FIELD_MAP: Record<SubraceOrderField, string> = {
  [SubraceOrderField.NAME]: 'name'
}

registerEnumType(SubraceOrderField, {
  name: 'SubraceOrderField',
  description: 'Fields to sort Subraces by'
})

@InputType()
export class SubraceOrder implements BaseOrderInterface<SubraceOrderField> {
  @Field(() => SubraceOrderField)
  by!: SubraceOrderField

  @Field(() => OrderByDirection)
  direction!: OrderByDirection

  @Field(() => SubraceOrder, { nullable: true })
  then_by?: SubraceOrder
}

export const SubraceOrderSchema: z.ZodType<SubraceOrder> = z.lazy(() =>
  z.object({
    by: z.nativeEnum(SubraceOrderField),
    direction: z.nativeEnum(OrderByDirection),
    then_by: SubraceOrderSchema.optional()
  })
)

export const SubraceArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  order: SubraceOrderSchema.optional()
})

export const SubraceIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class SubraceArgs extends BaseFilterArgs {
  @Field(() => SubraceOrder, {
    nullable: true,
    description: 'Specify sorting order for subraces.'
  })
  order?: SubraceOrder
}
