import { ArgsType, Field } from 'type-graphql'
import { z } from 'zod'

import { BaseFilterArgs, BaseFilterArgsSchema } from '@/graphql/common/args'
import { NumberFilterInput, NumberFilterInputSchema } from '@/graphql/common/inputs'

export const RaceArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  ability_bonus: z.array(z.string()).optional(),
  size: z.array(z.string()).optional(),
  language: z.array(z.string()).optional(),
  speed: NumberFilterInputSchema.optional()
})

@ArgsType()
export class RaceArgs extends BaseFilterArgs {
  @Field(() => [String], {
    nullable: true,
    description: 'Filter by one or more ability score indices that provide a bonus'
  })
  ability_bonus?: string[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by one or more race sizes (e.g., ["Medium", "Small"])'
  })
  size?: string[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by one or more language indices spoken by the race'
  })
  language?: string[]

  @Field(() => NumberFilterInput, {
    nullable: true,
    description: 'Filter by race speed. Allows exact match, list, or range.'
  })
  speed?: NumberFilterInput
}
