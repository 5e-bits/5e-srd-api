import { Resolver, Query, Arg, Args, ArgsType, Field, FieldResolver, Root } from 'type-graphql'
import { AbilityScore } from '@/models/2014/abilityScore'
import AbilityScoreModel from '@/models/2014/abilityScore'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { IsOptional, IsString, IsEnum } from 'class-validator'
import { escapeRegExp } from '@/util'
import { Skill } from '@/models/2014/skill'
import SkillModel from '@/models/2014/skill'
import { resolveMultipleReferences } from '@/graphql/2014rewrite/utils/resolvers'

@ArgsType()
class AbilityScoreArgs {
  @Field(() => String, {
    nullable: true,
    description:
      'Filter by ability score name (case-insensitive, partial match, checks both name and full_name)'
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

@Resolver(AbilityScore)
export class AbilityScoreResolver {
  @Query(() => [AbilityScore], {
    description: 'Gets all ability scores, optionally filtered by name and sorted by name.'
  })
  async abilityScores(
    @Args() { name, order_direction }: AbilityScoreArgs
  ): Promise<AbilityScore[]> {
    const query = AbilityScoreModel.find()

    if (name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
    }

    if (order_direction) {
      query.sort({ name: order_direction === OrderByDirection.DESC ? -1 : 1 })
    }

    return query.lean()
  }

  @Query(() => AbilityScore, {
    nullable: true,
    description: 'Gets a single ability score by index.'
  })
  async abilityScore(@Arg('index', () => String) index: string): Promise<AbilityScore | null> {
    return AbilityScoreModel.findOne({ index }).lean()
  }

  @FieldResolver(() => [Skill])
  async skills(@Root() abilityScore: AbilityScore): Promise<Skill[]> {
    return resolveMultipleReferences(abilityScore.skills, SkillModel)
  }
}
