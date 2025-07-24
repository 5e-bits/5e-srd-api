import { ArgsType, Field, InputType, registerEnumType } from 'type-graphql'
import { z } from 'zod'

import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema,
  BaseOrderInterface
} from '@/graphql/common/args'
import { OrderByDirection } from '@/graphql/common/enums'

export enum FeatOrderField {
  NAME = 'name'
}

export const FEAT_SORT_FIELD_MAP: Record<FeatOrderField, string> = {
  [FeatOrderField.NAME]: 'name'
}

registerEnumType(FeatOrderField, {
  name: 'FeatOrderField',
  description: 'Fields to sort Feats by'
})

@InputType()
export class FeatOrder implements BaseOrderInterface<FeatOrderField> {
  @Field(() => FeatOrderField)
  by!: FeatOrderField

  @Field(() => OrderByDirection)
  direction!: OrderByDirection

  @Field(() => FeatOrder, { nullable: true })
  then_by?: FeatOrder
}

export const FeatOrderSchema: z.ZodType<FeatOrder> = z.lazy(() =>
  z.object({
    by: z.nativeEnum(FeatOrderField),
    direction: z.nativeEnum(OrderByDirection),
    then_by: FeatOrderSchema.optional()
  })
)

export const FeatArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  order: FeatOrderSchema.optional()
})

export const FeatIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class FeatArgs extends BaseFilterArgs {
  @Field(() => FeatOrder, {
    nullable: true,
    description: 'Specify sorting order for feats.'
  })
  order?: FeatOrder
}
