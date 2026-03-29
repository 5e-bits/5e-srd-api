import { ArgsType, Field, InputType, registerEnumType } from 'type-graphql'
import { z } from 'zod'

import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema,
  BaseOrderInterface
} from '@/graphql/common/args'
import { OrderByDirection } from '@/graphql/common/enums'

export enum SubspeciesOrderField {
  NAME = 'name'
}

export const SUBSPECIES_SORT_FIELD_MAP: Record<SubspeciesOrderField, string> = {
  [SubspeciesOrderField.NAME]: 'name'
}

registerEnumType(SubspeciesOrderField, {
  name: 'Subspecies2024OrderField',
  description: 'Fields to sort Subspecies by'
})

@InputType()
export class SubspeciesOrder implements BaseOrderInterface<SubspeciesOrderField> {
  @Field(() => SubspeciesOrderField)
  by!: SubspeciesOrderField

  @Field(() => OrderByDirection)
  direction!: OrderByDirection

  @Field(() => SubspeciesOrder, { nullable: true })
  then_by?: SubspeciesOrder
}

export const SubspeciesOrderSchema: z.ZodType<SubspeciesOrder> = z.lazy(() =>
  z.object({
    by: z.nativeEnum(SubspeciesOrderField),
    direction: z.nativeEnum(OrderByDirection),
    then_by: SubspeciesOrderSchema.optional()
  })
)

export const SubspeciesArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  order: SubspeciesOrderSchema.optional()
})

export const SubspeciesIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class SubspeciesArgs extends BaseFilterArgs {
  @Field(() => SubspeciesOrder, {
    nullable: true,
    description: 'Specify sorting order for subspecies.'
  })
  order?: SubspeciesOrder
}
