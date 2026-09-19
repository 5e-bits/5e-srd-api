import { ArgsType, Field } from 'type-graphql'
import { z } from 'zod'

import { BaseFilterArgs, BaseFilterArgsSchema } from '@/graphql/common/args'

export const FeatArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  type: z.array(z.string()).optional()
})

@ArgsType()
export class FeatArgs extends BaseFilterArgs {
  @Field(() => [String], {
    nullable: true,
    description: 'Filter by feat type (e.g., ["origin", "general"])'
  })
  type?: string[]
}
