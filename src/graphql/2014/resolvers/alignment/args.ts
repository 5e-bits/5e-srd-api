import { ArgsType, Field, InputType, registerEnumType } from 'type-graphql'
import { z } from 'zod'

import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema,
  BaseOrderInterface
} from '@/graphql/common/args'
import { OrderByDirection } from '@/graphql/common/enums'

export enum AlignmentOrderField {
  NAME = 'name'
}

export const ALIGNMENT_SORT_FIELD_MAP: Record<AlignmentOrderField, string> = {
  [AlignmentOrderField.NAME]: 'name'
}

registerEnumType(AlignmentOrderField, {
  name: 'AlignmentOrderField',
  description: 'Fields to sort Alignments by'
})

@InputType()
export class AlignmentOrder implements BaseOrderInterface<AlignmentOrderField> {
  @Field(() => AlignmentOrderField)
  by!: AlignmentOrderField

  @Field(() => OrderByDirection)
  direction!: OrderByDirection

  @Field(() => AlignmentOrder, { nullable: true })
  then_by?: AlignmentOrder
}

export const AlignmentOrderSchema: z.ZodType<AlignmentOrder> = z.lazy(() =>
  z.object({
    by: z.nativeEnum(AlignmentOrderField),
    direction: z.nativeEnum(OrderByDirection),
    then_by: AlignmentOrderSchema.optional()
  })
)

export const AlignmentArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  order: AlignmentOrderSchema.optional()
})

export const AlignmentIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class AlignmentArgs extends BaseFilterArgs {
  @Field(() => AlignmentOrder, {
    nullable: true,
    description: 'Specify sorting order for alignments.'
  })
  order?: AlignmentOrder
}
