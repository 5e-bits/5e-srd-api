import { Resolver, Query, Arg, Args, ArgsType, Field } from 'type-graphql'
import { MagicSchool } from '@/models/2014/magicSchool' // Import the decorated Typegoose model
import MagicSchoolModel from '@/models/2014/magicSchool' // Import the default export for data access
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums' // Import shared enum
import { IsOptional, IsString, IsEnum } from 'class-validator'
import { escapeRegExp } from '@/util'

// Define ArgsType for the magicSchools query
@ArgsType()
class MagicSchoolArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by magic school name (case-insensitive, partial match)'
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

@Resolver(MagicSchool)
export class MagicSchoolResolver {
  @Query(() => [MagicSchool], {
    description: 'Gets all magic schools, optionally filtered by name and sorted by name.'
  })
  async magicSchools(@Args() { name, order_direction }: MagicSchoolArgs): Promise<MagicSchool[]> {
    const query = MagicSchoolModel.find()

    if (name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
    }

    if (order_direction) {
      query.sort({ name: order_direction === OrderByDirection.DESC ? -1 : 1 })
    }

    return query.lean()
  }

  @Query(() => MagicSchool, { nullable: true, description: 'Gets a single magic school by index.' })
  async magicSchool(@Arg('index', () => String) index: string): Promise<MagicSchool | null> {
    return MagicSchoolModel.findOne({ index }).lean()
  }
}
