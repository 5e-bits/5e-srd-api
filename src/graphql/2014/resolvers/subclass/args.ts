import { ArgsType, Field, InputType, registerEnumType } from 'type-graphql'
import { z } from 'zod'

import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema,
  BaseOrderInterface
} from '@/graphql/common/args'
import { OrderByDirection } from '@/graphql/common/enums'

export enum SubclassOrderField {
  NAME = 'name'
}

export const SUBCLASS_SORT_FIELD_MAP: Record<SubclassOrderField, string> = {
  [SubclassOrderField.NAME]: 'name'
}

registerEnumType(SubclassOrderField, {
  name: 'SubclassOrderField',
  description: 'Fields to sort Subclasses by'
})

@InputType()
export class SubclassOrder implements BaseOrderInterface<SubclassOrderField> {
  @Field(() => SubclassOrderField)
  by!: SubclassOrderField

  @Field(() => OrderByDirection)
  direction!: OrderByDirection

  @Field(() => SubclassOrder, { nullable: true })
  then_by?: SubclassOrder
}

export const SubclassOrderSchema: z.ZodType<SubclassOrder> = z.lazy(() =>
  z.object({
    by: z.nativeEnum(SubclassOrderField),
    direction: z.nativeEnum(OrderByDirection),
    then_by: SubclassOrderSchema.optional()
  })
)

export const SubclassArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  order: SubclassOrderSchema.optional()
})

export const SubclassIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class SubclassArgs extends BaseFilterArgs {
  @Field(() => SubclassOrder, {
    nullable: true,
    description: 'Specify sorting order for subclasses.'
  })
  order?: SubclassOrder
}
