import { Resolver, Query, Arg, Args, ArgsType, Field } from 'type-graphql'
import DamageTypeModel, { DamageType } from '@/models/2014/damageType'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { IsOptional, IsString, IsEnum } from 'class-validator'
import { escapeRegExp } from '@/util'

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
    description: 'Sort direction (default: ASC)'
  })
  @IsOptional()
  @IsEnum(OrderByDirection)
  order_direction?: OrderByDirection
}

@Resolver(DamageType)
export class DamageTypeResolver {
  @Query(() => [DamageType], {
    description: 'Gets all damage types, optionally filtered by name and sorted by name.'
  })
  async damageTypes(@Args() { name, order_direction }: DamageTypeArgs): Promise<DamageType[]> {
    const query = DamageTypeModel.find()

    if (name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
    }

    if (order_direction) {
      query.sort({ name: order_direction === OrderByDirection.DESC ? -1 : 1 })
    }

    return query.lean()
  }

  @Query(() => DamageType, { nullable: true, description: 'Gets a single damage type by index.' })
  async damageType(@Arg('index', () => String) index: string): Promise<DamageType | null> {
    return DamageTypeModel.findOne({ index }).lean()
  }
}
