import { Resolver, Query, Arg, Args, ArgsType, Field, FieldResolver, Root } from 'type-graphql'
import RuleModel, { Rule } from '@/models/2014/rule'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { IsOptional, IsString, IsEnum } from 'class-validator'
import { escapeRegExp } from '@/util'
import RuleSectionModel, { RuleSection } from '@/models/2014/ruleSection'
import { resolveMultipleReferences } from '@/graphql/2014rewrite/utils/resolvers'

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

    return query.lean()
  }

  @Query(() => Rule, { nullable: true, description: 'Gets a single rule by index.' })
  async rule(@Arg('index', () => String) index: string): Promise<Rule | null> {
    return RuleModel.findOne({ index }).lean()
  }

  @FieldResolver(() => [RuleSection], { nullable: true })
  async subsections(@Root() rule: Rule): Promise<RuleSection[]> {
    return resolveMultipleReferences(rule.subsections, RuleSectionModel)
  }
}
