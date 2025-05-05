import { Resolver, Query, Arg, Args, ArgsType, Field } from 'type-graphql'
import { Condition } from '@/models/2014/condition' // Import the decorated Typegoose model
import ConditionModel from '@/models/2014/condition' // Import the default export for data access
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums' // Import shared enum
import { IsOptional, IsString, IsEnum } from 'class-validator'
import { escapeRegExp } from '@/util'

// Define ArgsType for the conditions query
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
    description: 'Sort direction (default: ASC)'
  })
  @IsOptional()
  @IsEnum(OrderByDirection)
  order_direction?: OrderByDirection

  // Note: Sorting is hardcoded by 'name'
}

@Resolver(Condition)
export class ConditionResolver {
  @Query(() => [Condition], {
    description: 'Gets all conditions, optionally filtered by name and sorted by name.'
  })
  async conditions(@Args() { name, order_direction }: ConditionArgs): Promise<Condition[]> {
    const query = ConditionModel.find()

    if (name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
    }

    if (order_direction) {
      query.sort({ name: order_direction === OrderByDirection.DESC ? -1 : 1 })
    }

    return query.lean()
  }

  @Query(() => Condition, { nullable: true, description: 'Gets a single condition by index.' })
  async condition(@Arg('index', () => String) index: string): Promise<Condition | null> {
    return ConditionModel.findOne({ index }).lean()
  }
}
