import { Resolver, Query, Arg, Args, ArgsType, Field, registerEnumType } from 'type-graphql'
import AlignmentModel, { Alignment } from '@/models/2014/alignment' // Use lowercase filename convention
import { IsOptional, IsString, IsEnum } from 'class-validator'

// Define Enum for ordering
enum OrderByDirection {
  ASC = 'ASC',
  DESC = 'DESC'
}

// Register the enum with TypeGraphQL
registerEnumType(OrderByDirection, {
  name: 'OrderByDirection',
  description: 'Sort direction'
})

// Define ArgsType for alignments query
@ArgsType()
class AlignmentArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by alignment name (case-insensitive, partial match)'
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

  // Add other args like skip/limit if needed later
}

@Resolver(Alignment)
export class AlignmentResolver {
  @Query(() => [Alignment], { description: 'Gets all alignments, optionally filtered and sorted.' })
  async alignments(@Args() { name, order_direction }: AlignmentArgs): Promise<Alignment[]> {
    const query = AlignmentModel.find()

    // Apply filtering
    if (name !== undefined) {
      // Basic case-insensitive partial match
      query.where({ name: { $regex: new RegExp(name, 'i') } })
    }

    // Apply sorting (defaulting to name)
    const sortOrder = order_direction === OrderByDirection.DESC ? -1 : 1
    query.sort({ name: sortOrder })

    // .lean() returns plain JS objects, which TypeGraphQL works well with
    return query.lean()
  }

  @Query(() => Alignment, { nullable: true, description: 'Gets a single alignment by index.' })
  async alignment(@Arg('index', () => String) index: string): Promise<Alignment | null> {
    // Consider adding validation for index format if needed
    return AlignmentModel.findOne({ index }).lean()
  }
}
