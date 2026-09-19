import { ArgsType, Field } from 'type-graphql'
import { z } from 'zod'

import { BaseFilterArgs, BaseFilterArgsSchema } from '@/graphql/common/args'

export const ProficiencyArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  type: z.array(z.string()).optional()
})

@ArgsType()
export class ProficiencyArgs extends BaseFilterArgs {
  @Field(() => [String], {
    nullable: true,
    description: 'Filter by proficiency type (e.g., ["Skills", "Tools"])'
  })
  type?: string[]
}
