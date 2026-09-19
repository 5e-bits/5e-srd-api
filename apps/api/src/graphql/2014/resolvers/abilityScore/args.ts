import { ArgsType, Field } from 'type-graphql'
import { z } from 'zod'

import { BaseFilterArgs, BaseFilterArgsSchema } from '@/graphql/common/args'

export const AbilityScoreArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  full_name: z.string().optional()
})

@ArgsType()
export class AbilityScoreArgs extends BaseFilterArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by ability score full name (case-insensitive, partial match)'
  })
  full_name?: string
}
