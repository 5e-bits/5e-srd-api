import { Resolver, Query, Arg, Args, ArgsType, Field, FieldResolver, Root } from 'type-graphql'
import { Feat, Prerequisite } from '@/models/2014/feat'
import FeatModel from '@/models/2014/feat'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { IsOptional, IsString, IsEnum } from 'class-validator'
import { escapeRegExp } from '@/util'
// Import types and models needed for FieldResolver
import { AbilityScore } from '@/models/2014/abilityScore'
import AbilityScoreModel from '@/models/2014/abilityScore'
import { resolveSingleReference } from '@/graphql/2014rewrite/utils/resolvers'

@ArgsType()
class FeatArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by feat name (case-insensitive, partial match)'
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

@Resolver(Feat)
export class FeatResolver {
  @Query(() => [Feat], {
    description: 'Gets all feats, optionally filtered by name and sorted by name.'
  })
  async feats(@Args() { name, order_direction }: FeatArgs): Promise<Feat[]> {
    const query = FeatModel.find()

    if (name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
    }

    if (order_direction) {
      query.sort({ name: order_direction === OrderByDirection.DESC ? -1 : 1 })
    }

    return query.lean()
  }

  @Query(() => Feat, { nullable: true, description: 'Gets a single feat by index.' })
  async feat(@Arg('index', () => String) index: string): Promise<Feat | null> {
    return FeatModel.findOne({ index }).lean()
  }
}

// Separate resolver for nested Prerequisite type
@Resolver(Prerequisite)
export class PrerequisiteResolver {
  @FieldResolver(() => AbilityScore, { nullable: true })
  async ability_score(@Root() prerequisite: Prerequisite): Promise<AbilityScore | null> {
    return resolveSingleReference(prerequisite.ability_score, AbilityScoreModel)
  }
}
