import { ArgsType, Field, InputType, registerEnumType } from 'type-graphql'
import { z } from 'zod'

import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema,
  BaseOrderInterface
} from '@/graphql/common/args'
import { OrderByDirection } from '@/graphql/common/enums'

export enum TraitOrderField {
  NAME = 'name'
}

export const TRAIT_SORT_FIELD_MAP: Record<TraitOrderField, string> = {
  [TraitOrderField.NAME]: 'name'
}

registerEnumType(TraitOrderField, {
  name: 'TraitOrderField',
  description: 'Fields to sort Traits by'
})

@InputType()
export class TraitOrder implements BaseOrderInterface<TraitOrderField> {
  @Field(() => TraitOrderField)
  by!: TraitOrderField

  @Field(() => OrderByDirection)
  direction!: OrderByDirection

  @Field(() => TraitOrder, { nullable: true })
  then_by?: TraitOrder
}

export const TraitOrderSchema: z.ZodType<TraitOrder> = z.lazy(() =>
  z.object({
    by: z.nativeEnum(TraitOrderField),
    direction: z.nativeEnum(OrderByDirection),
    then_by: TraitOrderSchema.optional()
  })
)

export const TraitArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  order: TraitOrderSchema.optional()
})

export const TraitIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class TraitArgs extends BaseFilterArgs {
  @Field(() => TraitOrder, {
    nullable: true,
    description: 'Specify sorting order for traits.'
  })
  order?: TraitOrder
}
