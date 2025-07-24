import { ArgsType, Field, InputType, registerEnumType } from 'type-graphql'
import { z } from 'zod'

import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema,
  BaseOrderInterface
} from '@/graphql/common/args'
import { OrderByDirection } from '@/graphql/common/enums'

export enum BackgroundOrderField {
  NAME = 'name'
}

export const BACKGROUND_SORT_FIELD_MAP: Record<BackgroundOrderField, string> = {
  [BackgroundOrderField.NAME]: 'name'
}

registerEnumType(BackgroundOrderField, {
  name: 'BackgroundOrderField',
  description: 'Fields to sort Backgrounds by'
})

@InputType()
export class BackgroundOrder implements BaseOrderInterface<BackgroundOrderField> {
  @Field(() => BackgroundOrderField)
  by!: BackgroundOrderField

  @Field(() => OrderByDirection)
  direction!: OrderByDirection

  @Field(() => BackgroundOrder, { nullable: true })
  then_by?: BackgroundOrder
}

export const BackgroundOrderSchema: z.ZodType<BackgroundOrder> = z.lazy(() =>
  z.object({
    by: z.nativeEnum(BackgroundOrderField),
    direction: z.nativeEnum(OrderByDirection),
    then_by: BackgroundOrderSchema.optional()
  })
)

export const BackgroundArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  order: BackgroundOrderSchema.optional()
})

export const BackgroundIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class BackgroundArgs extends BaseFilterArgs {
  @Field(() => BackgroundOrder, {
    nullable: true,
    description: 'Specify sorting order for backgrounds.'
  })
  order?: BackgroundOrder
}
