import { Resolver, Query, Arg, Args, ArgsType, Field } from 'type-graphql'
import { IsOptional, IsString, IsEnum } from 'class-validator'
import SpellModel, { Spell } from '@/models/2014/spell'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { escapeRegExp } from '@/util'

@ArgsType()
class SpellArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by spell name (case-insensitive, partial match)'
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

  // Maybe add level filter later?
}

@Resolver(Spell)
export class SpellResolver {
  @Query(() => [Spell], { description: 'Gets all spells, optionally filtered by name and sorted.' })
  async spells(@Args() { name, order_direction }: SpellArgs): Promise<Spell[]> {
    const query = SpellModel.find()

    if (name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
    }

    if (order_direction) {
      query.sort({ name: order_direction === OrderByDirection.DESC ? -1 : 1 })
    }

    return query.lean()
  }

  @Query(() => Spell, { nullable: true, description: 'Gets a single spell by its index.' })
  async spell(@Arg('index', () => String) index: string): Promise<Spell | null> {
    return SpellModel.findOne({ index }).lean()
  }

  // TODO: Pass 2 - Field resolvers for references (school, classes, subclasses)
  // TODO: Pass 2/3 - Field resolvers for complex types (area_of_effect, damage, dc, heal_at_slot_level)
}
