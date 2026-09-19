import { ArgsType, Field, Int } from 'type-graphql'
import { z } from 'zod'

import { BasePaginationArgs, BasePaginationArgsSchema } from '@/graphql/common/args'
import { NumberFilterInput, NumberFilterInputSchema } from '@/graphql/common/inputs'

export const LevelArgsSchema = z.object({
  ...BasePaginationArgsSchema.shape,
  class: z.array(z.string()).optional(),
  subclass: z.array(z.string()).optional(),
  level: NumberFilterInputSchema.optional(),
  ability_score_bonuses: z.number().int().optional(),
  prof_bonus: z.number().int().optional()
})

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
}
