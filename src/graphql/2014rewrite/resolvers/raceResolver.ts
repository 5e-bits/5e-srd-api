import { Resolver, Query, Arg, Args, ArgsType, Field } from 'type-graphql'
import { IsOptional, IsString, IsEnum } from 'class-validator'
import RaceModel, { Race } from '@/models/2014/race'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { escapeRegExp } from '@/util'

@ArgsType()
class RaceArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by race name (case-insensitive, partial match)'
  })
  @IsOptional()
  @IsString()
  name?: string

  @Field(() => OrderByDirection, {
    nullable: true,
    defaultValue: OrderByDirection.ASC,
    description: 'Sort direction for the name field (default: ASC)'
  })
  @IsOptional()
  @IsEnum(OrderByDirection)
  order_direction?: OrderByDirection
}

@Resolver(Race)
export class RaceResolver {
  @Query(() => [Race], { description: 'Gets all races, optionally filtered by name and sorted.' })
  async races(@Args() { name, order_direction }: RaceArgs): Promise<Race[]> {
    const query = RaceModel.find()

    if (name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
    }

    if (order_direction) {
      query.sort({ name: order_direction === OrderByDirection.DESC ? -1 : 1 })
    }

    return query.lean()
  }

  @Query(() => Race, { nullable: true, description: 'Gets a single race by its index.' })
  async race(@Arg('index', () => String) index: string): Promise<Race | null> {
    return RaceModel.findOne({ index }).lean()
  }

  // TODO: Pass 2 - Field resolvers for references (ability_bonuses, languages, starting_proficiencies, subraces, traits)
  // TODO: Pass 3 - Field resolvers for choices (ability_bonus_options, language_options, starting_proficiency_options)
}
