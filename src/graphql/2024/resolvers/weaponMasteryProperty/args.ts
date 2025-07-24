import { ArgsType, Field, InputType, registerEnumType } from 'type-graphql'
import { z } from 'zod'

import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema,
  BaseOrderInterface
} from '@/graphql/common/args'
import { OrderByDirection } from '@/graphql/common/enums'

export enum WeaponMasteryPropertyOrderField {
  NAME = 'name'
}

export const WEAPON_MASTERY_PROPERTY_SORT_FIELD_MAP: Record<
  WeaponMasteryPropertyOrderField,
  string
> = {
  [WeaponMasteryPropertyOrderField.NAME]: 'name'
}

registerEnumType(WeaponMasteryPropertyOrderField, {
  name: 'WeaponMasteryPropertyOrderField',
  description: 'Fields to sort Weapon Mastery Properties by'
})

@InputType()
export class WeaponMasteryPropertyOrder
  implements BaseOrderInterface<WeaponMasteryPropertyOrderField>
{
  @Field(() => WeaponMasteryPropertyOrderField)
  by!: WeaponMasteryPropertyOrderField

  @Field(() => OrderByDirection)
  direction!: OrderByDirection

  @Field(() => WeaponMasteryPropertyOrder, { nullable: true })
  then_by?: WeaponMasteryPropertyOrder
}

export const WeaponMasteryPropertyOrderSchema: z.ZodType<WeaponMasteryPropertyOrder> = z.lazy(() =>
  z.object({
    by: z.nativeEnum(WeaponMasteryPropertyOrderField),
    direction: z.nativeEnum(OrderByDirection),
    then_by: WeaponMasteryPropertyOrderSchema.optional()
  })
)

export const WeaponMasteryPropertyArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  order: WeaponMasteryPropertyOrderSchema.optional()
})

export const WeaponMasteryPropertyIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class WeaponMasteryPropertyArgs extends BaseFilterArgs {
  @Field(() => WeaponMasteryPropertyOrder, {
    nullable: true,
    description: 'Specify sorting order for weapon mastery properties.'
  })
  order?: WeaponMasteryPropertyOrder
}
