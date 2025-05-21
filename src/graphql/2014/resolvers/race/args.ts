import { ArgsType, Field } from 'type-graphql'
import { z } from 'zod'
import { NumberFilterInput, NumberFilterInputSchema } from '@/graphql/2014/common/inputs'
import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema
} from '@/graphql/2014/common/args'

export const RaceArgsSchema = BaseFilterArgsSchema.extend({
  ability_bonus: z.array(z.string()).optional(),
  size: z.array(z.string()).optional(),
  language: z.array(z.string()).optional(),
  speed: NumberFilterInputSchema.optional()
})

export const RaceIndexArgsSchema = BaseIndexArgsSchema

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
