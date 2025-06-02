import { Field, InputType, Int } from 'type-graphql'
import { z } from 'zod'

// Zod schema for NumberRangeFilterInput
export const NumberRangeFilterInputSchema = z.object({
  lt: z.number().int().optional(),
  lte: z.number().int().optional(),
  gt: z.number().int().optional(),
  gte: z.number().int().optional()
})

@InputType({
  description:
    'Input for filtering integer fields, allowing exact match, a list of matches, or a range.'
})
export class NumberRangeFilterInput {
  @Field(() => Int, { nullable: true, description: 'Matches values less than.' })
  lt?: number

  @Field(() => Int, { nullable: true, description: 'Matches values less than or equal to.' })
  lte?: number

  @Field(() => Int, { nullable: true, description: 'Matches values greater than.' })
  gt?: number

  @Field(() => Int, { nullable: true, description: 'Matches values greater than or equal to.' })
  gte?: number
}

// Zod schema for NumberFilterInput
export const NumberFilterInputSchema = z.object({
  eq: z.number().int().optional(),
  in: z.array(z.number().int()).optional(),
  nin: z.array(z.number().int()).optional(),
  range: NumberRangeFilterInputSchema.optional()
})

@InputType({
  description: 'Input for filtering by an integer, an array of integers, or a range of integers.'
})
export class NumberFilterInput {
  @Field(() => Int, { nullable: true, description: 'Matches an exact integer value.' })
  eq?: number;

  @Field(() => [Int], {
    nullable: true,
    description: 'Matches any integer value in the provided list.'
  })
  in?: number[]

  @Field(() => [Int], {
    nullable: true,
    description: 'Matches no integer value in the provided list.'
  })
  nin?: number[]

  @Field(() => NumberRangeFilterInput, {
    nullable: true,
    description: 'Matches integer values within a specified range.'
  })
  range?: NumberRangeFilterInput
}

/**
 * Builds a MongoDB query object from a NumberFilterInput.
 * @param filterInput The NumberFilterInput object.
 * @returns A MongoDB query object for the number field, or null if the input is empty or invalid.
 */
export function buildMongoQueryFromNumberFilter(
  filterInput?: NumberFilterInput
): Record<string, any> | null {
  if (!filterInput) {
    return null
  }

  const queryPortion: any = {}

  if (typeof filterInput.eq === 'number') {
    queryPortion.$eq = filterInput.eq
  }
  if (Array.isArray(filterInput.in) && filterInput.in.length > 0) {
    queryPortion.$in = filterInput.in
  }
  if (Array.isArray(filterInput.nin) && filterInput.nin.length > 0) {
    queryPortion.$nin = filterInput.nin
  }
  if (filterInput.range) {
    if (typeof filterInput.range.lt === 'number') queryPortion.$lt = filterInput.range.lt
    if (typeof filterInput.range.lte === 'number') queryPortion.$lte = filterInput.range.lte
    if (typeof filterInput.range.gt === 'number') queryPortion.$gt = filterInput.range.gt
    if (typeof filterInput.range.gte === 'number') queryPortion.$gte = filterInput.range.gte
  }

  if (Object.keys(queryPortion).length === 0) {
    return null
  }

  return queryPortion
}
