import { Resolver, Query, Arg, Args, ArgsType, Field } from 'type-graphql'
import AlignmentModel, { Alignment } from '@/models/2014/alignment'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { IsOptional, IsString, IsEnum } from 'class-validator'
import { escapeRegExp } from '@/util'
import { buildMongoSortQuery } from '../common/inputs'

// Define ArgsType for the alignments query to handle filtering and sorting
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
    description: 'Sort direction (default: ASC)'
  })
  @IsOptional()
  @IsEnum(OrderByDirection)
  order_direction?: OrderByDirection
}

@Resolver(Alignment)
export class AlignmentResolver {
  @Query(() => [Alignment], {
    description: 'Gets all alignments, optionally filtered by name and sorted by name.'
  })
  async alignments(@Args() { name, order_direction }: AlignmentArgs): Promise<Alignment[]> {
    const query = AlignmentModel.find()

    if (name) {
      // Use escaped regex for case-insensitive partial match
      query.where({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
    }

    const sortQuery = buildMongoSortQuery({
      defaultSortField: 'name',
      orderDirection: order_direction
    })
    if (sortQuery) {
      query.sort(sortQuery)
    }

    return query.lean()
  }

  @Query(() => Alignment, { nullable: true, description: 'Gets a single alignment by index.' })
  async alignment(@Arg('index', () => String) index: string): Promise<Alignment | null> {
    // Find by index
    return AlignmentModel.findOne({ index }).lean()
  }
}
