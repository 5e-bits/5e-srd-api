import { Resolver, Query, Arg, Args, ArgsType, Field, Int, Float } from 'type-graphql'
import { IsOptional, IsString, IsEnum, IsNumber } from 'class-validator'
import { FilterQuery } from 'mongoose'
import MonsterModel, { Monster } from '@/models/2014/monster'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { escapeRegExp } from '@/util'

@ArgsType()
class MonsterArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by monster name (case-insensitive, partial match)'
  })
  @IsOptional()
  @IsString()
  name?: string

  @Field(() => Float, {
    nullable: true,
    description: 'Filter by exact challenge rating' // Simple filter for now
  })
  @IsOptional()
  @IsNumber()
  challenge_rating?: number

  @Field(() => String, { nullable: true, description: 'Filter by exact monster type' })
  @IsOptional()
  @IsString()
  type?: string

  @Field(() => OrderByDirection, {
    nullable: true,
    defaultValue: OrderByDirection.ASC,
    description: 'Sort direction for the name field (default: ASC)' // Sort by name or CR?
  })
  @IsOptional()
  @IsEnum(OrderByDirection)
  order_direction?: OrderByDirection

  // TODO: Add more filters (size, subtype, etc.) and sorting options later
}

@Resolver(Monster)
export class MonsterResolver {
  @Query(() => [Monster], {
    description:
      'Gets all monsters, optionally filtering by name, type, or challenge rating and sorted by name.'
  })
  async monsters(
    @Args() { name, challenge_rating, type, order_direction }: MonsterArgs
  ): Promise<Monster[]> {
    const filter: FilterQuery<Monster> = {}

    if (name) {
      filter.name = { $regex: new RegExp(escapeRegExp(name), 'i') }
    }

    if (challenge_rating !== undefined) {
      filter.challenge_rating = challenge_rating
    }

    if (type) {
      filter.type = type // Case-sensitive exact match for now
    }

    const query = MonsterModel.find(filter)

    if (order_direction) {
      query.sort({ name: order_direction === OrderByDirection.DESC ? -1 : 1 })
    }

    return query.lean()
  }

  @Query(() => Monster, { nullable: true, description: 'Gets a single monster by its index.' })
  async monster(@Arg('index', () => String) index: string): Promise<Monster | null> {
    return MonsterModel.findOne({ index }).lean()
  }

  // TODO: Pass 2/3 - Field resolvers for references/complex types (actions, armor_class, condition_immunities, forms, legendary_actions, proficiencies, reactions, special_abilities)
}
