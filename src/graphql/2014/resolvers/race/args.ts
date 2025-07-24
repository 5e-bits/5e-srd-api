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

export enum RaceOrderField {
  NAME = 'name'
}

export const RACE_SORT_FIELD_MAP: Record<RaceOrderField, string> = {
  [RaceOrderField.NAME]: 'name'
}

registerEnumType(RaceOrderField, {
  name: 'RaceOrderField',
  description: 'Fields to sort Races by'
})

@InputType()
export class RaceOrder implements BaseOrderInterface<RaceOrderField> {
  @Field(() => RaceOrderField)
  by!: RaceOrderField

  @Field(() => OrderByDirection)
  direction!: OrderByDirection

  @Field(() => RaceOrder, { nullable: true })
  then_by?: RaceOrder
}

export const RaceOrderSchema: z.ZodType<RaceOrder> = z.lazy(() =>
  z.object({
    by: z.nativeEnum(RaceOrderField),
    direction: z.nativeEnum(OrderByDirection),
    then_by: RaceOrderSchema.optional()
  })
)

export const RaceArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  ability_bonus: z.array(z.string()).optional(),
  size: z.array(z.string()).optional(),
  language: z.array(z.string()).optional(),
  speed: NumberFilterInputSchema.optional(),
  order: RaceOrderSchema.optional()
})

export const RaceIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class RaceArgs extends BaseFilterArgs {
  @Field(() => [String], {
    nullable: true,
    description: 'Filter by one or more ability score indices that provide a bonus'
  })
  ability_bonus?: string[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by one or more race sizes (e.g., ["Medium", "Small"])'
  })
  size?: string[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by one or more language indices spoken by the race'
  })
  language?: string[]

  @Field(() => NumberFilterInput, {
    nullable: true,
    description: 'Filter by race speed. Allows exact match, list, or range.'
  })
  speed?: NumberFilterInput

  @Field(() => RaceOrder, {
    nullable: true,
    description: 'Specify sorting order for races. Allows nested sorting.'
  })
  order?: RaceOrder
}
