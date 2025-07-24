import { ArgsType, Field, InputType, registerEnumType } from 'type-graphql'
import { z } from 'zod'

import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema,
  BaseOrderInterface
} from '@/graphql/common/args'
import { OrderByDirection } from '@/graphql/common/enums'

export enum AbilityScoreOrderField {
  NAME = 'name',
  FULL_NAME = 'full_name'
}

export const ABILITY_SCORE_SORT_FIELD_MAP: Record<AbilityScoreOrderField, string> = {
  [AbilityScoreOrderField.NAME]: 'name',
  [AbilityScoreOrderField.FULL_NAME]: 'full_name'
}

registerEnumType(AbilityScoreOrderField, {
  name: 'AbilityScoreOrderField',
  description: 'Fields to sort Ability Scores by'
})

@InputType()
export class AbilityScoreOrder implements BaseOrderInterface<AbilityScoreOrderField> {
  @Field(() => AbilityScoreOrderField)
  by!: AbilityScoreOrderField

  @Field(() => OrderByDirection)
  direction!: OrderByDirection

  @Field(() => AbilityScoreOrder, { nullable: true })
  then_by?: AbilityScoreOrder
}

export const AbilityScoreOrderSchema: z.ZodType<AbilityScoreOrder> = z.lazy(() =>
  z.object({
    by: z.nativeEnum(AbilityScoreOrderField),
    direction: z.nativeEnum(OrderByDirection),
    then_by: AbilityScoreOrderSchema.optional()
  })
)

export const AbilityScoreArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  full_name: z.string().optional(),
  order: AbilityScoreOrderSchema.optional()
})

export const AbilityScoreIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class AbilityScoreArgs extends BaseFilterArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by ability score full name (case-insensitive, partial match)'
  })
  full_name?: string

  @Field(() => AbilityScoreOrder, {
    nullable: true,
    description: 'Specify sorting order for ability scores.'
  })
  order?: AbilityScoreOrder
}
