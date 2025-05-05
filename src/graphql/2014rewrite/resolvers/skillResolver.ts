import { Resolver, Query, Arg, Args, ArgsType, Field, FieldResolver, Root } from 'type-graphql'
import { Skill } from '@/models/2014/skill'
import SkillModel from '@/models/2014/skill'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { IsOptional, IsString, IsEnum } from 'class-validator'
import { escapeRegExp } from '@/util'
import { AbilityScore } from '@/models/2014/abilityScore'
import AbilityScoreModel from '@/models/2014/abilityScore'
import { resolveSingleReference } from '../utils/resolvers'

@ArgsType()
class SkillArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by skill name (case-insensitive, partial match)'
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

@Resolver(Skill)
export class SkillResolver {
  @Query(() => [Skill], {
    description: 'Gets all skills, optionally filtered by name and sorted by name.'
  })
  async skills(@Args() { name, order_direction }: SkillArgs): Promise<Skill[]> {
    const query = SkillModel.find()

    if (name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
    }

    if (order_direction) {
      query.sort({ name: order_direction === OrderByDirection.DESC ? -1 : 1 })
    }

    return query.lean()
  }

  @Query(() => Skill, { nullable: true, description: 'Gets a single skill by index.' })
  async skill(@Arg('index', () => String) index: string): Promise<Skill | null> {
    return SkillModel.findOne({ index }).lean()
  }

  @FieldResolver(() => AbilityScore)
  async ability_score(@Root() skill: Skill): Promise<AbilityScore | null> {
    return resolveSingleReference(skill.ability_score, AbilityScoreModel)
  }
}
