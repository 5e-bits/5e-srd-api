import { ArgsType, Field } from 'type-graphql'
import { z } from 'zod'

import { BaseFilterArgs, BaseFilterArgsSchema } from '@/graphql/common/args'

export const LanguageArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  type: z.string().optional(),
  script: z.array(z.string()).optional()
})

@ArgsType()
export class LanguageArgs extends BaseFilterArgs {
  @Field(() => String, {
    nullable: true,
    description:
      'Filter by language type (e.g., Standard, Exotic) - case-insensitive exact match after normalization'
  })
  type?: string

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by one or more language scripts (e.g., ["Common", "Elvish"])'
  })
  script?: string[]
}
