import { InputType, Field, Int } from 'type-graphql'
import { IsOptional, IsInt, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { OrderByDirection } from './enums'

@InputType({
  description:
    'Input for filtering integer fields, allowing exact match, a list of matches, or a range.'
})
export class NumberRangeFilterInput {
  @Field(() => Int, { nullable: true, description: 'Matches values less than.' })
  @IsOptional()
  @IsInt()
  lt?: number

  @Field(() => Int, { nullable: true, description: 'Matches values less than or equal to.' })
  @IsOptional()
  @IsInt()
  lte?: number

  @Field(() => Int, { nullable: true, description: 'Matches values greater than.' })
  @IsOptional()
  @IsInt()
  gt?: number

  @Field(() => Int, { nullable: true, description: 'Matches values greater than or equal to.' })
  @IsOptional()
  @IsInt()
  gte?: number
}

@InputType({
  description: 'Input for filtering by an integer, an array of integers, or a range of integers.'
})
export class NumberFilterInput {
  @Field(() => Int, { nullable: true, description: 'Matches an exact integer value.' })
  @IsOptional()
  @IsInt()
  eq?: number;

  @Field(() => [Int], {
    nullable: true,
    description: 'Matches any integer value in the provided list.'
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  in?: number[]

  @Field(() => [Int], {
    nullable: true,
    description: 'Matches no integer value in the provided list.'
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  nin?: number[]

  @Field(() => NumberRangeFilterInput, {
    nullable: true,
    description: 'Matches integer values within a specified range.'
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => NumberRangeFilterInput)
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

interface BuildMongoSortQueryArgs<T extends string | symbol | number> {
  orderBy?: T
  orderDirection?: OrderByDirection
  sortFieldMap?: Record<T, string>
  defaultSortField?: string
}

/**
 * Builds a MongoDB sort query object based on order_by and order_direction arguments.
 *
 * @template T - The type of the order_by enum (string | symbol | number).
 * @param {BuildMongoSortQueryArgs<T>} args - The arguments for building the sort query.
 * @returns {Record<string, 1 | -1> | null} A MongoDB sort object, or null if no sort direction is provided.
 */
export function buildMongoSortQuery<T extends string | symbol | number>({
  orderBy,
  orderDirection,
  sortFieldMap,
  defaultSortField = 'name'
}: BuildMongoSortQueryArgs<T>): Record<string, 1 | -1> | null {
  if (!orderDirection) {
    return null
  }

  const sortOrder = orderDirection === OrderByDirection.DESC ? -1 : 1
  let resolvedSortField = defaultSortField

  if (orderBy) {
    if (sortFieldMap && sortFieldMap[orderBy]) {
      resolvedSortField = sortFieldMap[orderBy]
    } else if (sortFieldMap && !sortFieldMap[orderBy]) {
      console.warn(
        `buildMongoSortQuery: orderBy key '${String(orderBy)}' not found in sortFieldMap. Defaulting to sort by '${resolvedSortField}'.`
      )
    } else if (!sortFieldMap) {
      console.warn(
        `buildMongoSortQuery: orderBy '${String(orderBy)}' provided without a sortFieldMap. Defaulting to sort by '${resolvedSortField}'.`
      )
    }
  }

  return { [resolvedSortField]: sortOrder }
}
