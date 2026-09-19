import { ArgsType, Field, InputType, Int } from 'type-graphql'
import { z } from 'zod'

import { BaseFilterArgs, BaseFilterArgsSchema } from '@/graphql/common/args'
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
  range: z.array(z.string()).optional()
})

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
    description: 'Filter by casting time (e.g., ["Action"])'
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
}
