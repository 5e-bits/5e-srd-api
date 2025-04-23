import { ArgsType, Field } from 'type-graphql'
import { IsOptional, IsString, IsEnum } from 'class-validator'
import { OrderByDirection } from '@/graphql/common/enums'

@ArgsType()
export class NameSortArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by name (case-insensitive, partial match)'
  })
  @IsOptional()
  @IsString()
  name?: string

  @Field(() => OrderByDirection, {
    nullable: true,
    defaultValue: OrderByDirection.ASC,
    description: 'Order results (default: name ASC)'
  })
  @IsOptional()
  @IsEnum(OrderByDirection)
  order_direction?: OrderByDirection
}
