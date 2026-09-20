import { ArgsType, Field } from 'type-graphql'
import { z } from 'zod'

import { BaseFilterArgs, BaseFilterArgsSchema } from '@/graphql/common/args'
import { NumberFilterInput, NumberFilterInputSchema } from '@/graphql/common/inputs'

export const ClassArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  hit_die: NumberFilterInputSchema.optional()
})

@ArgsType()
export class ClassArgs extends BaseFilterArgs {
  @Field(() => NumberFilterInput, {
    nullable: true,
    description: 'Filter by hit die size. Allows exact match, list of values, or a range.'
  })
  hit_die?: NumberFilterInput
}
