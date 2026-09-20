import { ArgsType, Field } from 'type-graphql'
import { z } from 'zod'

import { BaseFilterArgs, BaseFilterArgsSchema } from '@/graphql/common/args'
import { NumberFilterInput, NumberFilterInputSchema } from '@/graphql/common/inputs'

export const MonsterArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  type: z.string().optional(),
  subtype: z.string().optional(),
  challenge_rating: NumberFilterInputSchema.optional(),
  size: z.string().optional(),
  xp: NumberFilterInputSchema.optional(),
  strength: NumberFilterInputSchema.optional(),
  dexterity: NumberFilterInputSchema.optional(),
  constitution: NumberFilterInputSchema.optional(),
  intelligence: NumberFilterInputSchema.optional(),
  wisdom: NumberFilterInputSchema.optional(),
  charisma: NumberFilterInputSchema.optional(),
  damage_vulnerabilities: z.array(z.string()).optional(),
  damage_resistances: z.array(z.string()).optional(),
  damage_immunities: z.array(z.string()).optional(),
  condition_immunities: z.array(z.string()).optional()
})

@ArgsType()
export class MonsterArgs extends BaseFilterArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by monster type (case-insensitive, exact match, e.g., "beast")'
  })
  type?: string

  @Field(() => String, {
    nullable: true,
    description: 'Filter by monster subtype (case-insensitive, exact match, e.g., "goblinoid")'
  })
  subtype?: string

  @Field(() => NumberFilterInput, {
    nullable: true,
    description: 'Filter by challenge rating'
  })
  challenge_rating?: NumberFilterInput

  @Field(() => String, {
    nullable: true,
    description: 'Filter by monster size (exact match, e.g., "Medium")'
  })
  size?: string

  @Field(() => NumberFilterInput, {
    nullable: true,
    description: 'Filter by monster XP'
  })
  xp?: NumberFilterInput

  @Field(() => NumberFilterInput, {
    nullable: true,
    description: 'Filter by strength score'
  })
  strength?: NumberFilterInput

  @Field(() => NumberFilterInput, {
    nullable: true,
    description: 'Filter by dexterity score'
  })
  dexterity?: NumberFilterInput

  @Field(() => NumberFilterInput, {
    nullable: true,
    description: 'Filter by constitution score'
  })
  constitution?: NumberFilterInput

  @Field(() => NumberFilterInput, {
    nullable: true,
    description: 'Filter by intelligence score'
  })
  intelligence?: NumberFilterInput

  @Field(() => NumberFilterInput, {
    nullable: true,
    description: 'Filter by wisdom score'
  })
  wisdom?: NumberFilterInput

  @Field(() => NumberFilterInput, {
    nullable: true,
    description: 'Filter by charisma score'
  })
  charisma?: NumberFilterInput

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by damage vulnerability indices'
  })
  damage_vulnerabilities?: string[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by damage resistance indices'
  })
  damage_resistances?: string[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by damage immunity indices'
  })
  damage_immunities?: string[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by condition immunity indices'
  })
  condition_immunities?: string[]
}
