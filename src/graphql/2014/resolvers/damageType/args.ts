import { ArgsType, Field, InputType, registerEnumType } from 'type-graphql'
import { z } from 'zod'

import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema,
  BaseOrderInterface
} from '@/graphql/common/args'
import { OrderByDirection } from '@/graphql/common/enums'

export enum DamageTypeOrderField {
  NAME = 'name'
}

export const DAMAGE_TYPE_SORT_FIELD_MAP: Record<DamageTypeOrderField, string> = {
  [DamageTypeOrderField.NAME]: 'name'
}

registerEnumType(DamageTypeOrderField, {
  name: 'DamageTypeOrderField',
  description: 'Fields to sort Damage Types by'
})

@InputType()
export class DamageTypeOrder implements BaseOrderInterface<DamageTypeOrderField> {
  @Field(() => DamageTypeOrderField)
  by!: DamageTypeOrderField

  @Field(() => OrderByDirection)
  direction!: OrderByDirection

  @Field(() => DamageTypeOrder, { nullable: true })
  then_by?: DamageTypeOrder
}

export const DamageTypeOrderSchema: z.ZodType<DamageTypeOrder> = z.lazy(() =>
  z.object({
    by: z.nativeEnum(DamageTypeOrderField),
    direction: z.nativeEnum(OrderByDirection),
    then_by: DamageTypeOrderSchema.optional()
  })
)

export const DamageTypeArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  order: DamageTypeOrderSchema.optional()
})

export const DamageTypeIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class DamageTypeArgs extends BaseFilterArgs {
  @Field(() => DamageTypeOrder, {
    nullable: true,
    description: 'Specify sorting order for damage types.'
  })
  order?: DamageTypeOrder
}
