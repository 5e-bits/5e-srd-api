import { InputType, Field, Int } from 'type-graphql'
import { IsOptional, IsInt, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

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
