import { Resolver, Query, Arg, Args, ArgsType, Field, Int } from 'type-graphql'
import { z } from 'zod'
import WeaponPropertyModel, { WeaponProperty } from '@/models/2014/weaponProperty'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { escapeRegExp } from '@/util'
import { buildMongoSortQuery } from '@/graphql/2014rewrite/common/inputs'

const WeaponPropertyArgsSchema = z.object({
  name: z.string().optional(),
  order_direction: z.nativeEnum(OrderByDirection).optional().default(OrderByDirection.ASC),
  skip: z.number().int().min(0).optional(),
  limit: z.number().int().min(1).optional()
})

const WeaponPropertyIndexArgsSchema = z.object({
  index: z.string().min(1, { message: 'Index must be a non-empty string' })
})

@ArgsType()
class WeaponPropertyArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by weapon property name (case-insensitive, partial match)'
  })
  name?: string

  @Field(() => OrderByDirection, {
    nullable: true,
    description: 'Sort direction (default: ASC)'
  })
  order_direction?: OrderByDirection

  @Field(() => Int, { nullable: true, description: 'TODO: Pass 5 - Number of results to skip' })
  skip?: number

  @Field(() => Int, {
    nullable: true,
    description: 'TODO: Pass 5 - Maximum number of results to return'
  })
  limit?: number
}

@Resolver(WeaponProperty)
export class WeaponPropertyResolver {
  @Query(() => [WeaponProperty], {
    description: 'Gets all weapon properties, optionally filtered by name and sorted by name.'
  })
  async weaponProperties(@Args() args: WeaponPropertyArgs): Promise<WeaponProperty[]> {
    const validatedArgs = WeaponPropertyArgsSchema.parse(args)
    const query = WeaponPropertyModel.find()

    if (validatedArgs.name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    const sortQuery = buildMongoSortQuery({
      orderDirection: validatedArgs.order_direction,
      defaultSortField: 'name'
    })

    if (sortQuery) {
      query.sort(sortQuery)
    }

    return query.lean()
  }

  @Query(() => WeaponProperty, {
    nullable: true,
    description: 'Gets a single weapon property by index.'
  })
  async weaponProperty(@Arg('index') indexInput: string): Promise<WeaponProperty | null> {
    const { index } = WeaponPropertyIndexArgsSchema.parse({ index: indexInput })
    return WeaponPropertyModel.findOne({ index }).lean()
  }
}
