import { Resolver, Query, Arg, Args, ArgsType, Field } from 'type-graphql'
import { Proficiency } from '@/models/2014/proficiency'
import ProficiencyModel from '@/models/2014/proficiency'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { IsOptional, IsString, IsEnum } from 'class-validator'
import { escapeRegExp } from '@/util'

// Define ArgsType for the proficiencies query
@ArgsType()
class ProficiencyArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by proficiency name (case-insensitive, partial match)'
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

@Resolver(Proficiency)
export class ProficiencyResolver {
  @Query(() => [Proficiency], {
    description: 'Query all Proficiencies, optionally filtered by name and sorted by name.'
  })
  async proficiencies(@Args() { name, order_direction }: ProficiencyArgs): Promise<Proficiency[]> {
    const query = ProficiencyModel.find()

    if (name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
      const sortOrder = order_direction === OrderByDirection.DESC ? -1 : 1
      query.sort({ name: sortOrder })
    }

    // Note: .lean() is used, so reference fields will contain raw data
    // FieldResolvers will be added in Pass 2.
    return query.lean()
  }

  @Query(() => Proficiency, {
    nullable: true,
    description: 'Gets a single proficiency by index.'
  })
  async proficiency(@Arg('index', () => String) index: string): Promise<Proficiency | null> {
    return ProficiencyModel.findOne({ index }).lean()
  }

  // TODO: Pass 2 - Field resolvers for references (classes, races, reference)
}
