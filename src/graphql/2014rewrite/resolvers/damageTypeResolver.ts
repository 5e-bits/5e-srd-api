import { Resolver, Query, Arg, Args, ArgsType, Field, Int } from 'type-graphql'
import { z } from 'zod'
import DamageTypeModel, { DamageType } from '@/models/2014/damageType'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { escapeRegExp } from '@/util'
import { buildMongoSortQuery } from '../common/inputs'

const DamageTypeArgsSchema = z.object({
  name: z.string().optional(),
  order_direction: z.nativeEnum(OrderByDirection).optional().default(OrderByDirection.ASC),
  skip: z.number().int().min(0).optional(),
  limit: z.number().int().min(1).optional()
})

const DamageTypeIndexArgsSchema = z.object({
  index: z.string().min(1, { message: 'Index must be a non-empty string' })
})

@ArgsType()
class DamageTypeArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by damage type name (case-insensitive, partial match)'
  })
  name?: string

  @Field(() => OrderByDirection, {
    nullable: true,
    description: 'Sort direction (default: ASC for name)'
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

@Resolver(DamageType)
export class DamageTypeResolver {
  @Query(() => [DamageType], {
    description: 'Gets all damage types, optionally filtered by name and sorted by name.'
  })
  async damageTypes(@Args() args: DamageTypeArgs): Promise<DamageType[]> {
    const validatedArgs = DamageTypeArgsSchema.parse(args)

    const query = DamageTypeModel.find()

    if (validatedArgs.name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    const sortQuery = buildMongoSortQuery({
      defaultSortField: 'name',
      orderDirection: validatedArgs.order_direction
    })
    if (sortQuery) {
      query.sort(sortQuery)
    }

    return query.lean()
  }

  @Query(() => DamageType, { nullable: true, description: 'Gets a single damage type by index.' })
  async damageType(@Arg('index', () => String) indexInput: string): Promise<DamageType | null> {
    const { index } = DamageTypeIndexArgsSchema.parse({ index: indexInput })
    return DamageTypeModel.findOne({ index }).lean()
  }
}
