import { ArgsType, Field, InputType, registerEnumType } from 'type-graphql'
import { z } from 'zod'

import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema,
  BaseOrderInterface
} from '@/graphql/2014/common/args'

import { OrderByDirection } from '../../common/enums'

export enum RuleOrderField {
  NAME = 'name'
}

export const RULE_SORT_FIELD_MAP: Record<RuleOrderField, string> = {
  [RuleOrderField.NAME]: 'name'
}

registerEnumType(RuleOrderField, {
  name: 'RuleOrderField',
  description: 'Fields to sort Rules by'
})

@InputType()
export class RuleOrder implements BaseOrderInterface<RuleOrderField> {
  @Field(() => RuleOrderField)
  by!: RuleOrderField

  @Field(() => OrderByDirection)
  direction!: OrderByDirection

  @Field(() => RuleOrder, { nullable: true })
  then_by?: RuleOrder
}

export const RuleOrderSchema: z.ZodType<RuleOrder> = z.lazy(() =>
  z.object({
    by: z.nativeEnum(RuleOrderField),
    direction: z.nativeEnum(OrderByDirection),
    then_by: RuleOrderSchema.optional()
  })
)

export const RuleArgsSchema = BaseFilterArgsSchema.extend({
  order: RuleOrderSchema.optional()
})

export const RuleIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class RuleArgs extends BaseFilterArgs {
  @Field(() => RuleOrder, {
    nullable: true,
    description: 'Specify sorting order for rules. Allows nested sorting.'
  })
  order?: RuleOrder
}
