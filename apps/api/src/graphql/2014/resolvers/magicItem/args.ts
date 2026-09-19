import { ArgsType, Field } from 'type-graphql'
import { z } from 'zod'

import { BaseFilterArgs, BaseFilterArgsSchema } from '@/graphql/common/args'

export const MagicItemArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  equipment_category: z.array(z.string()).optional(),
  rarity: z.array(z.string()).optional()
})

@ArgsType()
export class MagicItemArgs extends BaseFilterArgs {
  @Field(() => [String], {
    nullable: true,
    description: 'Filter by one or more equipment category indices (e.g., ["armor", "weapon"])'
  })
  equipment_category?: string[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by one or more rarity names (e.g., ["Rare", "Legendary"])'
  })
  rarity?: string[]
}
