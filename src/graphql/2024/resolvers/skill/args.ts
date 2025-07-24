import { ArgsType, Field, InputType, registerEnumType } from 'type-graphql'
import { z } from 'zod'

import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema,
  BaseOrderInterface
} from '@/graphql/common/args'
import { OrderByDirection } from '@/graphql/common/enums'

export enum SkillOrderField {
  NAME = 'name',
  ABILITY_SCORE = 'ability_score'
}

export const SKILL_SORT_FIELD_MAP: Record<SkillOrderField, string> = {
  [SkillOrderField.NAME]: 'name',
  [SkillOrderField.ABILITY_SCORE]: 'ability_score.name'
}

registerEnumType(SkillOrderField, {
  name: 'SkillOrderField',
  description: 'Fields to sort Skills by'
})

@InputType()
export class SkillOrder implements BaseOrderInterface<SkillOrderField> {
  @Field(() => SkillOrderField)
  by!: SkillOrderField

  @Field(() => OrderByDirection)
  direction!: OrderByDirection

  @Field(() => SkillOrder, { nullable: true })
  then_by?: SkillOrder
}

export const SkillOrderSchema: z.ZodType<SkillOrder> = z.lazy(() =>
  z.object({
    by: z.nativeEnum(SkillOrderField),
    direction: z.nativeEnum(OrderByDirection),
    then_by: SkillOrderSchema.optional()
  })
)

export const SkillArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  ability_score: z.array(z.string()).optional(),
  order: SkillOrderSchema.optional()
})

export const SkillIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class SkillArgs extends BaseFilterArgs {
  @Field(() => [String], {
    nullable: true,
    description: 'Filter by ability score index (e.g., ["str", "dex"])'
  })
  ability_score?: string[]

  @Field(() => SkillOrder, {
    nullable: true,
    description: 'Specify sorting order for skills.'
  })
  order?: SkillOrder
}
