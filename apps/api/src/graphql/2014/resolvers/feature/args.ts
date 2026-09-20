import { ArgsType, Field } from 'type-graphql'
import { z } from 'zod'

import { BaseFilterArgs, BaseFilterArgsSchema } from '@/graphql/common/args'
import { NumberFilterInput, NumberFilterInputSchema } from '@/graphql/common/inputs'

export const FeatureArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  level: NumberFilterInputSchema.optional(),
  class: z.array(z.string()).optional(),
  subclass: z.array(z.string()).optional()
})

@ArgsType()
export class FeatureArgs extends BaseFilterArgs {
  @Field(() => NumberFilterInput, {
    nullable: true,
    description: 'Filter by level. Allows exact match, list, or range.'
  })
  level?: NumberFilterInput

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by one or more associated class indices'
  })
  class?: string[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by one or more associated subclass indices'
  })
  subclass?: string[]
}
