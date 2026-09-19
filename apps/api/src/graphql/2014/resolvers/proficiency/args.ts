import { ArgsType, Field } from 'type-graphql'
import { z } from 'zod'

import { BaseFilterArgs, BaseFilterArgsSchema } from '@/graphql/common/args'

export const ProficiencyArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  class: z.array(z.string()).optional(),
  race: z.array(z.string()).optional(),
  type: z.array(z.string()).optional()
})

// Define ArgsType for the proficiencies query
@ArgsType()
export class ProficiencyArgs extends BaseFilterArgs {
  @Field(() => [String], {
    nullable: true,
    description: 'Filter by class index (e.g., ["barbarian", "bard"])'
  })
  class?: string[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by race index (e.g., ["dragonborn", "dwarf"])'
  })
  race?: string[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by proficiency type (exact match, e.g., ["ARMOR", "WEAPONS"])'
  })
  type?: string[]
}
