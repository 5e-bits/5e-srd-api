import { ArgsType, Field, InputType, registerEnumType } from 'type-graphql'
import { z } from 'zod'

import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema,
  BaseOrderInterface
} from '@/graphql/common/args'
import { OrderByDirection } from '@/graphql/common/enums'

export enum WeaponPropertyOrderField {
  NAME = 'name'
}

export const WEAPON_PROPERTY_SORT_FIELD_MAP: Record<WeaponPropertyOrderField, string> = {
  [WeaponPropertyOrderField.NAME]: 'name'
}

registerEnumType(WeaponPropertyOrderField, {
  name: 'WeaponPropertyOrderField',
  description: 'Fields to sort Weapon Properties by'
})

@InputType()
export class WeaponPropertyOrder implements BaseOrderInterface<WeaponPropertyOrderField> {
  @Field(() => WeaponPropertyOrderField)
  by!: WeaponPropertyOrderField

  @Field(() => OrderByDirection)
  direction!: OrderByDirection

  @Field(() => WeaponPropertyOrder, { nullable: true })
  then_by?: WeaponPropertyOrder
}

export const WeaponPropertyOrderSchema: z.ZodType<WeaponPropertyOrder> = z.lazy(() =>
  z.object({
    by: z.nativeEnum(WeaponPropertyOrderField),
    direction: z.nativeEnum(OrderByDirection),
    then_by: WeaponPropertyOrderSchema.optional()
  })
)

export const WeaponPropertyArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  order: WeaponPropertyOrderSchema.optional()
})

export const WeaponPropertyIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class WeaponPropertyArgs extends BaseFilterArgs {
  @Field(() => WeaponPropertyOrder, {
    nullable: true,
    description: 'Specify sorting order for weapon properties.'
  })
  order?: WeaponPropertyOrder
}
