import { ArgsType, Field } from 'type-graphql'
import { z } from 'zod'

import { BaseFilterArgs, BaseFilterArgsSchema } from '@/graphql/common/args'
import { NumberFilterInput, NumberFilterInputSchema } from '@/graphql/common/inputs'

export const PoisonArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  cost: NumberFilterInputSchema.optional(),
  type: z.array(z.string()).optional()
})

@ArgsType()
export class PoisonArgs extends BaseFilterArgs {
  @Field(() => NumberFilterInput, {
    nullable: true,
    description: 'Filter by cost. Allows exact match, list, or range.'
  })
  cost?: NumberFilterInput

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by one or more poison delivery types.'
  })
  type?: string[]
}
