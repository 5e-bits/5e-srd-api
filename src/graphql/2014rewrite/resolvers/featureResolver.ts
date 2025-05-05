import { Resolver, Query, Arg, Args, ArgsType, Field } from 'type-graphql'
import { IsOptional, IsString, IsEnum } from 'class-validator'
import FeatureModel, { Feature } from '@/models/2014/feature'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { escapeRegExp } from '@/util'

@ArgsType()
class FeatureArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by feature name (case-insensitive, partial match)'
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

@Resolver(Feature)
export class FeatureResolver {
  @Query(() => [Feature], {
    description: 'Gets all features, optionally filtered by name and sorted.'
  })
  async features(@Args() { name, order_direction }: FeatureArgs): Promise<Feature[]> {
    const query = FeatureModel.find()

    if (name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
      const sortOrder = order_direction === OrderByDirection.DESC ? -1 : 1
      query.sort({ name: sortOrder })
    }

    return query.lean()
  }

  @Query(() => Feature, { nullable: true, description: 'Gets a single feature by its index.' })
  async feature(@Arg('index', () => String) index: string): Promise<Feature | null> {
    return FeatureModel.findOne({ index }).lean()
  }

  // TODO: Pass 2 - Field resolvers for references (class, subclass, parent, prerequisites)
}
