import { ArgsType, Field, InputType, registerEnumType } from 'type-graphql'
import { z } from 'zod'

import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema,
  BaseOrderInterface
} from '@/graphql/2014/common/args'

import { OrderByDirection } from '../../common/enums'

export enum RuleSectionOrderField {
  NAME = 'name'
}

export const RULE_SECTION_SORT_FIELD_MAP: Record<RuleSectionOrderField, string> = {
  [RuleSectionOrderField.NAME]: 'name'
}

registerEnumType(RuleSectionOrderField, {
  name: 'RuleSectionOrderField',
  description: 'Fields to sort Rule Sections by'
})

@InputType()
export class RuleSectionOrder implements BaseOrderInterface<RuleSectionOrderField> {
  @Field(() => RuleSectionOrderField)
  by!: RuleSectionOrderField

  @Field(() => OrderByDirection)
  direction!: OrderByDirection

  @Field(() => RuleSectionOrder, { nullable: true })
  then_by?: RuleSectionOrder
}

export const RuleSectionOrderSchema: z.ZodType<RuleSectionOrder> = z.lazy(() =>
  z.object({
    by: z.nativeEnum(RuleSectionOrderField),
    direction: z.nativeEnum(OrderByDirection),
    then_by: RuleSectionOrderSchema.optional()
  })
)

export const RuleSectionArgsSchema = BaseFilterArgsSchema.extend({
  order: RuleSectionOrderSchema.optional()
})

export const RuleSectionIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class RuleSectionArgs extends BaseFilterArgs {
  @Field(() => RuleSectionOrder, {
    nullable: true,
    description: 'Specify sorting order for rule sections. Allows nested sorting.'
  })
  order?: RuleSectionOrder
}
