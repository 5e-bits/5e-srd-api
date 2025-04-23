import { Resolver, Query, Arg, Args, ArgsType, Field } from 'type-graphql'
import { Condition } from '@/models/2014/condition' // Import the decorated model class
import ConditionModel from '@/models/2014/condition' // Import the default export for data access
import { IsOptional, IsString, IsEnum } from 'class-validator'
import { OrderByDirection } from '@/graphql/common/enums' // Import shared enum

// ArgsType for conditions query
@ArgsType()
class ConditionArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by condition name (case-insensitive, partial match)'
  })
  @IsOptional()
  @IsString()
  name?: string

  @Field(() => OrderByDirection, {
    nullable: true,
    defaultValue: OrderByDirection.ASC,
    description: 'Field to sort by (default: name ASC)'
  })
  @IsOptional()
  @IsEnum(OrderByDirection)
  order_direction?: OrderByDirection
}

@Resolver(Condition)
export class ConditionResolver {
  @Query(() => [Condition], { description: 'Gets all conditions, optionally filtered and sorted.' })
  async conditions(
    @Args(() => ConditionArgs) { name, order_direction }: ConditionArgs
  ): Promise<Condition[]> {
    const query = ConditionModel.find()

    // Filtering
    if (name !== undefined) {
      query.where({ name: { $regex: new RegExp(name, 'i') } })
    }

    // Sorting
    const sortOrder = order_direction === OrderByDirection.DESC ? -1 : 1
    query.sort({ name: sortOrder })

    return query.lean()
  }

  @Query(() => Condition, { nullable: true, description: 'Gets a single condition by its index.' })
  async condition(@Arg('index', () => String) index: string): Promise<Condition | null> {
    return ConditionModel.findOne({ index }).lean()
  }
}
