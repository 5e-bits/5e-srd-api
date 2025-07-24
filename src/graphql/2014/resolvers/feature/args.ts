import { ArgsType, Field, InputType, registerEnumType } from 'type-graphql'
import { z } from 'zod'

import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema,
  BaseOrderInterface
} from '@/graphql/common/args'
import { OrderByDirection } from '@/graphql/common/enums'
import { NumberFilterInput, NumberFilterInputSchema } from '@/graphql/common/inputs'

export enum FeatureOrderField {
  NAME = 'name',
  LEVEL = 'level',
  CLASS = 'class',
  SUBCLASS = 'subclass'
}

export const FEATURE_SORT_FIELD_MAP: Record<FeatureOrderField, string> = {
  [FeatureOrderField.NAME]: 'name',
  [FeatureOrderField.LEVEL]: 'level',
  [FeatureOrderField.CLASS]: 'class.name',
  [FeatureOrderField.SUBCLASS]: 'subclass.name'
}

registerEnumType(FeatureOrderField, {
  name: 'FeatureOrderField',
  description: 'Fields to sort Features by'
})

@InputType()
export class FeatureOrder implements BaseOrderInterface<FeatureOrderField> {
  @Field(() => FeatureOrderField)
  by!: FeatureOrderField

  @Field(() => OrderByDirection)
  direction!: OrderByDirection

  @Field(() => FeatureOrder, { nullable: true })
  then_by?: FeatureOrder
}

export const FeatureOrderSchema: z.ZodType<FeatureOrder> = z.lazy(() =>
  z.object({
    by: z.nativeEnum(FeatureOrderField),
    direction: z.nativeEnum(OrderByDirection),
    then_by: FeatureOrderSchema.optional()
  })
)

export const FeatureArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  level: NumberFilterInputSchema.optional(),
  class: z.array(z.string()).optional(),
  subclass: z.array(z.string()).optional(),
  order: FeatureOrderSchema.optional()
})

export const FeatureIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class FeatureArgs extends BaseFilterArgs {
  @Field(() => NumberFilterInput, {
    nullable: true,
    description: 'Filter by level. Allows exact match, list, or range.'
  })
  level?: NumberFilterInput

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by one or more associated class indices'
  })
  class?: string[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by one or more associated subclass indices'
  })
  subclass?: string[]

  @Field(() => FeatureOrder, {
    nullable: true,
    description: 'Specify sorting order for features.'
  })
  order?: FeatureOrder
}
