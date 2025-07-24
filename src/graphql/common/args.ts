import { ArgsType, Field, Int } from 'type-graphql'
import { z } from 'zod'

import { OrderByDirection } from '@/graphql/common/enums'

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

export const BaseFilterArgsSchema = z.object({
  ...BasePaginationArgsSchema.shape,
  name: z.string().optional()
})

@ArgsType()
export class BaseFilterArgs extends BasePaginationArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by name (case-insensitive, partial match).'
  })
  name?: string
}

// --- Index Argument ---

export const BaseIndexArgsSchema = z.object({
  index: z.string().min(1, { message: 'Index must be a non-empty string' })
})

// --- Generic Sorting Logic ---

export interface BaseOrderInterface<TOrderFieldValue extends string> {
  by: TOrderFieldValue
  direction: OrderByDirection
  then_by?: BaseOrderInterface<TOrderFieldValue>
}

interface BuildSortPipelineArgs<TOrderFieldValue extends string> {
  order?: BaseOrderInterface<TOrderFieldValue>
  sortFieldMap: Record<string, string>
  defaultSortField?: TOrderFieldValue
  defaultSortDirection?: OrderByDirection
}

export function buildSortPipeline<TOrderFieldValue extends string>({
  order,
  sortFieldMap,
  defaultSortField,
  defaultSortDirection = OrderByDirection.ASC
}: BuildSortPipelineArgs<TOrderFieldValue>): Record<string, 1 | -1> {
  const sortPipeline: Record<string, 1 | -1> = {}

  function populateSortPipelineRecursive(
    currentOrder: BaseOrderInterface<TOrderFieldValue> | undefined
  ) {
    if (!currentOrder) {
      return
    }

    const fieldKey = currentOrder.by
    const mappedDbField = sortFieldMap[fieldKey]

    if (mappedDbField) {
      const direction = currentOrder.direction === OrderByDirection.ASC ? 1 : -1
      sortPipeline[mappedDbField] = direction
    } else {
      console.warn(
        `Sort field for key "${fieldKey}" not found in sortFieldMap. Skipping this criterion.`
      )
    }

    if (currentOrder.then_by) {
      populateSortPipelineRecursive(currentOrder.then_by)
    }
  }

  populateSortPipelineRecursive(order)

  if (Object.keys(sortPipeline).length === 0 && defaultSortField != null) {
    const defaultFieldKey = String(defaultSortField)
    const defaultMappedField = sortFieldMap[defaultFieldKey]
    if (defaultMappedField) {
      sortPipeline[defaultMappedField] = defaultSortDirection === OrderByDirection.ASC ? 1 : -1
    } else {
      console.warn(
        `Default sort field for key "${defaultFieldKey}" not found in sortFieldMap. No default sort will be applied.`
      )
    }
  }

  return sortPipeline
}
