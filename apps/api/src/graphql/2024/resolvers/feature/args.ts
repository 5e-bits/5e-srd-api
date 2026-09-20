import { ArgsType, Field } from 'type-graphql'
import { z } from 'zod'

import { BaseFilterArgs, BaseFilterArgsSchema } from '@/graphql/common/args'

export const FeatureArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  level: z.array(z.string()).optional(),
  class: z.array(z.string()).optional(),
  subclass: z.array(z.string()).optional()
})

@ArgsType()
export class FeatureArgs extends BaseFilterArgs {
  @Field(() => [String], {
    nullable: true,
    description: 'Filter by one or more level indices.'
  })
  level?: string[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by one or more associated class indices.'
  })
  class?: string[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by one or more associated subclass indices.'
  })
  subclass?: string[]
}
