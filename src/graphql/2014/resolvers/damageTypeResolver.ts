import { Resolver, Query, Arg, Args, ArgsType } from 'type-graphql'
import { z } from 'zod'
import DamageTypeModel, { DamageType } from '@/models/2014/damageType'
import { escapeRegExp } from '@/util'
import { buildMongoSortQuery } from '@/graphql/2014/common/inputs'
import { BaseFilterNameSortArgs, BaseFilterNameSortArgsSchema } from '../common/args'

const DamageTypeArgsSchema = BaseFilterNameSortArgsSchema

const DamageTypeIndexArgsSchema = z.object({
  index: z.string().min(1, { message: 'Index must be a non-empty string' })
})

@ArgsType()
class DamageTypeArgs extends BaseFilterNameSortArgs {}

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
      orderDirection: validatedArgs.order_direction,
      defaultSortField: 'name'
    })

    if (sortQuery) {
      query.sort(sortQuery)
    }

    if (validatedArgs.skip) {
      query.skip(validatedArgs.skip)
    }
    if (validatedArgs.limit) {
      query.limit(validatedArgs.limit)
    }

    return query.lean()
  }

  @Query(() => DamageType, { nullable: true, description: 'Gets a single damage type by index.' })
  async damageType(@Arg('index') indexInput: string): Promise<DamageType | null> {
    const { index } = DamageTypeIndexArgsSchema.parse({ index: indexInput })
    return DamageTypeModel.findOne({ index }).lean()
  }
}
