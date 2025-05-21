import { ArgsType, Field } from 'type-graphql'
import { z } from 'zod'
import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema
} from '@/graphql/2014/common/args'

export const AbilityScoreArgsSchema = BaseFilterArgsSchema.extend({
  full_name: z.string().optional()
})

export const AbilityScoreIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class AbilityScoreArgs extends BaseFilterArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by ability score full name (case-insensitive, partial match)'
  })
  full_name?: string
}
