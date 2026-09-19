import { ArgsType, Field } from 'type-graphql'
import { z } from 'zod'

import { BaseFilterArgs, BaseFilterArgsSchema } from '@/graphql/common/args'

export const SkillArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  ability_score: z.array(z.string()).optional()
})

@ArgsType()
export class SkillArgs extends BaseFilterArgs {
  @Field(() => [String], {
    nullable: true,
    description: 'Filter by ability score index (e.g., ["str", "dex"])'
  })
  ability_score?: string[]
}
