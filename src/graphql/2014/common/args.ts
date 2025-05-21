import { ArgsType, Field, Int } from 'type-graphql'
import { z } from 'zod'
import { OrderByDirection } from './enums'

// --- Pagination ---

export const BasePaginationArgsSchema = z.object({
  skip: z.number().int().min(0).optional().default(0),
  limit: z.number().int().min(1).optional().default(100) // Default 50, Max 100
})

@ArgsType()
export class BasePaginationArgs {
  @Field(() => Int, {
    nullable: true,
    description: 'Number of results to skip for pagination. Default: 0.'
  })
  skip?: number

  @Field(() => Int, {
    nullable: true,
    description: 'Maximum number of results to return for pagination. Default: 50, Max: 100.'
  })
  limit?: number
}

// --- Filtering & Sorting by Name (includes Pagination) ---

export const BaseFilterArgsSchema = z
  .object({
    name: z.string().optional(),
    order_direction: z.nativeEnum(OrderByDirection).optional().default(OrderByDirection.ASC)
  })
  .merge(BasePaginationArgsSchema) // Include pagination fields

@ArgsType()
export class BaseFilterArgs extends BasePaginationArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by name (case-insensitive, partial match).'
  })
  name?: string

  @Field(() => OrderByDirection, {
    nullable: true,
    description: 'Sort direction for the name field (default: ASC).'
    // DefaultValue is handled by Zod schema
  })
  order_direction?: OrderByDirection
}

// --- Index Argument ---

export const BaseIndexArgsSchema = z.object({
  index: z.string().min(1, { message: 'Index must be a non-empty string' })
})
