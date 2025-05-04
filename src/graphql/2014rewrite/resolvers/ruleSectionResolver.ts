import { Resolver, Query, Arg, Args, ArgsType, Field } from 'type-graphql'
import { RuleSection } from '@/models/2014/ruleSection' // Import the decorated Typegoose model
import RuleSectionModel from '@/models/2014/ruleSection' // Import the default export for data access
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums' // Import shared enum
import { IsOptional, IsString, IsEnum } from 'class-validator'
import { escapeRegExp } from '@/util'

// Define ArgsType for the ruleSections query
@ArgsType()
class RuleSectionArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by rule section name (case-insensitive, partial match)'
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

@Resolver(RuleSection)
export class RuleSectionResolver {
  @Query(() => [RuleSection], {
    description: 'Gets all rule sections, optionally filtered by name and sorted by name.'
  })
  async ruleSections(@Args() { name, order_direction }: RuleSectionArgs): Promise<RuleSection[]> {
    const query = RuleSectionModel.find()

    if (name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
    }

    const sortOrder = order_direction === OrderByDirection.DESC ? -1 : 1
    query.sort({ name: sortOrder })

    return query.lean()
  }

  @Query(() => RuleSection, { nullable: true, description: 'Gets a single rule section by index.' })
  async ruleSection(@Arg('index', () => String) index: string): Promise<RuleSection | null> {
    return RuleSectionModel.findOne({ index }).lean()
  }
}
