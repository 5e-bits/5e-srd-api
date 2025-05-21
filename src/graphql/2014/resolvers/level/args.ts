import { ArgsType, Field, Int, registerEnumType } from 'type-graphql'
import { z } from 'zod'
import { OrderByDirection } from '@/graphql/2014/common/enums'
import { NumberFilterInput, NumberFilterInputSchema } from '@/graphql/2014/common/inputs'
import {
  BasePaginationArgs,
  BasePaginationArgsSchema,
  BaseIndexArgsSchema
} from '@/graphql/2014/common/args'

export enum LevelOrderField {
  LEVEL = 'level',
  CLASS = 'class',
  SUBCLASS = 'subclass'
}

registerEnumType(LevelOrderField, {
  name: 'LevelOrderField',
  description: 'Fields to sort Levels by'
})

export const LEVEL_SORT_FIELD_MAP: Record<LevelOrderField, string> = {
  [LevelOrderField.LEVEL]: 'level',
  [LevelOrderField.CLASS]: 'class.name',
  [LevelOrderField.SUBCLASS]: 'subclass.name'
}

export const LevelArgsSchema = BasePaginationArgsSchema.extend({
  class: z.array(z.string()).optional(),
  subclass: z.array(z.string()).optional(),
  level: NumberFilterInputSchema.optional(),
  ability_score_bonuses: z.number().int().optional(),
  prof_bonus: z.number().int().optional(),
  order_by: z.nativeEnum(LevelOrderField).optional(),
  order_direction: z.nativeEnum(OrderByDirection).optional().default(OrderByDirection.ASC)
})

export const LevelIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class LevelArgs extends BasePaginationArgs {
  @Field(() => [String], { nullable: true, description: 'Filter by one or more class indices' })
  class?: string[]

  @Field(() => [String], { nullable: true, description: 'Filter by one or more subclass indices' })
  subclass?: string[]

  @Field(() => NumberFilterInput, {
    nullable: true,
    description: 'Filter by level. Allows exact match, list, or range.'
  })
  level?: NumberFilterInput

  @Field(() => Int, {
    nullable: true,
    description: 'Filter by the exact number of ability score bonuses granted at this level.'
  })
  ability_score_bonuses?: number

  @Field(() => Int, {
    nullable: true,
    description: 'Filter by the exact proficiency bonus at this level.'
  })
  prof_bonus?: number

  @Field(() => LevelOrderField, { nullable: true, description: 'Field to sort levels by.' })
  order_by?: LevelOrderField

  @Field(() => OrderByDirection, {
    nullable: true,
    description: 'Sort direction for the chosen field (default: ASC)'
  })
  order_direction?: OrderByDirection
}
