import { Resolver, Query, Arg, Args, ArgsType, Field } from 'type-graphql'
import { IsOptional, IsString, IsEnum } from 'class-validator'
import SubclassModel, { Subclass } from '@/models/2014/subclass'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { escapeRegExp } from '@/util'

@ArgsType()
class SubclassArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by subclass name (case-insensitive, partial match)'
  })
  @IsOptional()
  @IsString()
  name?: string

  @Field(() => OrderByDirection, {
    nullable: true,
    defaultValue: OrderByDirection.ASC,
    description: 'Sort direction for the name field (default: ASC)'
  })
  @IsOptional()
  @IsEnum(OrderByDirection)
  order_direction?: OrderByDirection
}

@Resolver(Subclass)
export class SubclassResolver {
  @Query(() => [Subclass], {
    description: 'Gets all subclasses, optionally filtered by name and sorted.'
  })
  async subclasses(@Args() { name, order_direction }: SubclassArgs): Promise<Subclass[]> {
    const query = SubclassModel.find()

    if (name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
    }

    if (order_direction) {
      query.sort({ name: order_direction === OrderByDirection.DESC ? -1 : 1 })
    }

    return query.lean()
  }

  @Query(() => Subclass, { nullable: true, description: 'Gets a single subclass by its index.' })
  async subclass(@Arg('index', () => String) index: string): Promise<Subclass | null> {
    return SubclassModel.findOne({ index }).lean()
  }

  // TODO: Pass 2 - Field resolvers for references (class, subclass_levels)
  // TODO: Pass 2/3 - Field resolvers for complex types (spells)
}
