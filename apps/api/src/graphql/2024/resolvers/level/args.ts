import { ArgsType, Field } from 'type-graphql'
import { z } from 'zod'

import { BasePaginationArgs, BasePaginationArgsSchema } from '@/graphql/common/args'
import { NumberFilterInput, NumberFilterInputSchema } from '@/graphql/common/inputs'

export const LevelArgsSchema = z.object({
  ...BasePaginationArgsSchema.shape,
  class: z.array(z.string()).optional(),
  subclass: z.array(z.string()).optional(),
  level: NumberFilterInputSchema.optional(),
  prof_bonus: NumberFilterInputSchema.optional()
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

  @Field(() => NumberFilterInput, {
    nullable: true,
    description: 'Filter by proficiency bonus. Allows exact match, list, or range.'
  })
  prof_bonus?: NumberFilterInput
}
