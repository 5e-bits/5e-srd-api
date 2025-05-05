import { Resolver, Query, Arg, Args, ArgsType, Field } from 'type-graphql'
import { Background } from '@/models/2014/background' // Import the decorated Typegoose model
import BackgroundModel from '@/models/2014/background' // Import the default export for data access
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums' // Import shared enum
import { IsOptional, IsString, IsEnum } from 'class-validator'
import { escapeRegExp } from '@/util'

// Define ArgsType for the backgrounds query
@ArgsType()
class BackgroundArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by background name (case-insensitive, partial match)'
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

@Resolver(Background)
export class BackgroundResolver {
  @Query(() => [Background], {
    description: 'Gets all backgrounds, optionally filtered by name and sorted by name.'
  })
  async backgrounds(@Args() { name, order_direction }: BackgroundArgs): Promise<Background[]> {
    const query = BackgroundModel.find()

    if (name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
      const sortOrder = order_direction === OrderByDirection.DESC ? -1 : 1
      query.sort({ name: sortOrder })
    }

    // Note: .lean() is used, so reference/choice fields will contain raw data
    // FieldResolvers will be added in Pass 2/3.
    return query.lean()
  }

  @Query(() => Background, { nullable: true, description: 'Gets a single background by index.' })
  async background(@Arg('index', () => String) index: string): Promise<Background | null> {
    // Note: .lean() is used, reference/choice fields will contain raw data.
    // FieldResolvers needed in Pass 2/3.
    return BackgroundModel.findOne({ index }).lean()
  }

  // Field Resolvers for references (starting_proficiencies, starting_equipment.equipment) will be added in Pass 2
  // Field Resolvers for choices (language_options, etc.) will be added in Pass 3
}
