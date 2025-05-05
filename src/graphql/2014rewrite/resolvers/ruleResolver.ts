import { Resolver, Query, Arg, Args, ArgsType, Field } from 'type-graphql'
import { Rule } from '@/models/2014/rule' // Import the decorated Typegoose model
import RuleModel from '@/models/2014/rule' // Import the default export for data access
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums' // Import shared enum
import { IsOptional, IsString, IsEnum } from 'class-validator'
import { escapeRegExp } from '@/util'
// Import RuleSection if needed for FieldResolver placeholder
// import { RuleSection } from '@/models/2014/ruleSection';

// Define ArgsType for the rules query
@ArgsType()
class RuleArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by rule name (case-insensitive, partial match)'
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

@Resolver(Rule)
export class RuleResolver {
  @Query(() => [Rule], {
    description: 'Gets all rules, optionally filtered by name and sorted by name.'
  })
  async rules(@Args() { name, order_direction }: RuleArgs): Promise<Rule[]> {
    const query = RuleModel.find()

    if (name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
    }

    if (order_direction) {
      query.sort({ name: order_direction === OrderByDirection.DESC ? -1 : 1 })
    }

    // Note: .lean() is used, so the subsections field will contain the raw APIReference data
    // A FieldResolver will be added in Pass 2.
    return query.lean()
  }

  @Query(() => Rule, { nullable: true, description: 'Gets a single rule by index.' })
  async rule(@Arg('index', () => String) index: string): Promise<Rule | null> {
    // Note: .lean() is used, subsections field will be raw APIReference data.
    // FieldResolver needed in Pass 2.
    return RuleModel.findOne({ index }).lean()
  }

  // Field Resolver for 'subsections' will be added in Pass 2
  /*
  @FieldResolver(() => [RuleSection]) // Assuming RuleSection is the decorated @ObjectType
  async subsections(@Root() rule: Rule): Promise<RuleSection[]> {
    // Logic to fetch RuleSections based on rule.subsections references
    return []; // Placeholder
  }
  */
}
