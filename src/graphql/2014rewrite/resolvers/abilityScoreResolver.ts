import { Resolver, Query, Arg, Args, ArgsType, Field, FieldResolver, Root } from 'type-graphql'
import { IsOptional, IsString, IsEnum } from 'class-validator'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { resolveMultipleReferences } from '@/graphql/2014rewrite/utils/resolvers'
import AbilityScoreModel, { AbilityScore } from '@/models/2014/abilityScore'
import SkillModel, { Skill } from '@/models/2014/skill'
import { escapeRegExp } from '@/util'

@ArgsType()
class AbilityScoreArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by ability score name (case-insensitive, partial match)'
  })
  @IsOptional()
  @IsString()
  name?: string

  @Field(() => String, {
    nullable: true,
    description: 'Filter by ability score full name (case-insensitive, partial match)'
  })
  @IsOptional()
  @IsString()
  full_name?: string

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
    @Args() { name, full_name, order_direction }: AbilityScoreArgs
  ): Promise<AbilityScore[]> {
    const query = AbilityScoreModel.find()
    const filters: any[] = []

    if (name) {
      filters.push({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
    }

    if (full_name) {
      filters.push({ full_name: { $regex: new RegExp(escapeRegExp(full_name), 'i') } })
    }

    if (filters.length > 0) {
      query.where({ $and: filters })
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
