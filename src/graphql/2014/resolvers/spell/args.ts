import { ArgsType, Field, InputType, Int, registerEnumType } from 'type-graphql'
import { z } from 'zod'

import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema,
  BaseOrderInterface
} from '@/graphql/common/args'
import { OrderByDirection } from '@/graphql/common/enums'
import { NumberFilterInput, NumberFilterInputSchema } from '@/graphql/common/inputs'

const AreaOfEffectFilterInputSchema = z.object({
  type: z.array(z.string()).optional(),
  size: NumberFilterInputSchema.optional()
})

@InputType({
  description: 'Input for filtering by area of effect properties.'
})
export class AreaOfEffectFilterInput {
  @Field(() => [String], {
    nullable: true,
    description: 'Filter by area of effect type (e.g., ["sphere", "cone"])'
  })
  type?: string[]

  @Field(() => NumberFilterInput, {
    nullable: true,
    description: 'Filter by area of effect size (in feet).'
  })
  size?: NumberFilterInput
}

// Enum for Spell sortable fields
export enum SpellOrderField {
  NAME = 'name',
  LEVEL = 'level',
  SCHOOL = 'school',
  AREA_OF_EFFECT_SIZE = 'area_of_effect_size' // Matches old API
}

export const SPELL_SORT_FIELD_MAP: Record<SpellOrderField, string> = {
  [SpellOrderField.NAME]: 'name',
  [SpellOrderField.LEVEL]: 'level',
  [SpellOrderField.SCHOOL]: 'school.name',
  [SpellOrderField.AREA_OF_EFFECT_SIZE]: 'area_of_effect.size'
}

registerEnumType(SpellOrderField, {
  name: 'SpellOrderField',
  description: 'Fields to sort Spells by'
})

@InputType()
export class SpellOrder implements BaseOrderInterface<SpellOrderField> {
  @Field(() => SpellOrderField)
  by!: SpellOrderField

  @Field(() => OrderByDirection)
  direction!: OrderByDirection

  @Field(() => SpellOrder, { nullable: true })
  then_by?: SpellOrder
}

export const SpellOrderSchema: z.ZodType<SpellOrder> = z.lazy(() =>
  z.object({
    by: z.nativeEnum(SpellOrderField),
    direction: z.nativeEnum(OrderByDirection),
    then_by: SpellOrderSchema.optional()
  })
)

export const SpellArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  level: z.array(z.number().int().min(0).max(9)).optional(),
  school: z.array(z.string()).optional(),
  class: z.array(z.string()).optional(),
  subclass: z.array(z.string()).optional(),
  concentration: z.boolean().optional(),
  ritual: z.boolean().optional(),
  attack_type: z.array(z.string()).optional(),
  casting_time: z.array(z.string()).optional(),
  area_of_effect: AreaOfEffectFilterInputSchema.optional(),
  damage_type: z.array(z.string()).optional(),
  dc_type: z.array(z.string()).optional(),
  range: z.array(z.string()).optional(),
  order: SpellOrderSchema.optional()
})

export const SpellIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class SpellArgs extends BaseFilterArgs {
  @Field(() => [Int], {
    nullable: true,
    description: 'Filter by spell level (e.g., [0, 9])'
  })
  level?: number[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by magic school index (e.g., ["evocation"])'
  })
  school?: string[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by class index that can cast the spell (e.g., ["wizard"])'
  })
  class?: string[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by subclass index that can cast the spell (e.g., ["lore"])'
  })
  subclass?: string[]

  @Field(() => Boolean, { nullable: true, description: 'Filter by concentration requirement' })
  concentration?: boolean

  @Field(() => Boolean, { nullable: true, description: 'Filter by ritual requirement' })
  ritual?: boolean

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by attack type (e.g., ["ranged", "melee"])'
  })
  attack_type?: string[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by casting time (e.g., ["1 action"])'
  })
  casting_time?: string[]

  @Field(() => AreaOfEffectFilterInput, {
    nullable: true,
    description: 'Filter by area of effect properties'
  })
  area_of_effect?: AreaOfEffectFilterInput

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by damage type index (e.g., ["fire"])'
  })
  damage_type?: string[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by saving throw DC type index (e.g., ["dex"])'
  })
  dc_type?: string[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by spell range (e.g., ["Self", "Touch"])'
  })
  range?: string[]

  @Field(() => SpellOrder, {
    nullable: true,
    description: 'Specify sorting order for spells.'
  })
  order?: SpellOrder
}
