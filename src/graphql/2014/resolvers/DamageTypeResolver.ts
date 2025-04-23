import { Resolver, Query, Arg, Args, ArgsType, Field } from 'type-graphql'
import { DamageType } from '@/models/2014/damageType' // Import the Typegoose model/ObjectType
import DamageTypeModel from '@/models/2014/damageType' // Import the default export for data access
import { IsOptional, IsString, IsEnum } from 'class-validator'
import { OrderByDirection } from '@/graphql/common/enums'

// Define ArgsType for damageTypes query
@ArgsType()
class DamageTypeArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by damage type name (case-insensitive, partial match)'
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

@Resolver(DamageType)
export class DamageTypeResolver {
  @Query(() => [DamageType], {
    description: 'Gets all damage types, optionally filtered and sorted.'
  })
  async damageTypes(
    @Args(() => DamageTypeArgs) { name, order_direction }: DamageTypeArgs
  ): Promise<DamageType[]> {
    const query = DamageTypeModel.find()

    // Apply filtering
    if (name) {
      query.where({ name: { $regex: new RegExp(name, 'i') } })
    }

    // Apply sorting
    const sortOrder = order_direction === OrderByDirection.DESC ? -1 : 1
    query.sort({ name: sortOrder })

    return query.lean()
  }

  @Query(() => DamageType, {
    nullable: true,
    description: 'Gets a single damage type by index.'
  })
  async damageType(@Arg('index', () => String) index: string): Promise<DamageType | null> {
    return DamageTypeModel.findOne({ index }).lean()
  }
}
