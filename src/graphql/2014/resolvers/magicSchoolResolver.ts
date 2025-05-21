import { Resolver, Query, Arg, Args, ArgsType } from 'type-graphql'
import { z } from 'zod'
import MagicSchoolModel, { MagicSchool } from '@/models/2014/magicSchool'
import { escapeRegExp } from '@/util'
import { buildMongoSortQuery } from '@/graphql/2014/common/inputs'
import { BaseFilterArgs, BaseFilterArgsSchema } from '../common/args'

const MagicSchoolArgsSchema = BaseFilterArgsSchema

const MagicSchoolIndexArgsSchema = z.object({
  index: z.string().min(1, { message: 'Index must be a non-empty string' })
})

@ArgsType()
class MagicSchoolArgs extends BaseFilterArgs {}

@Resolver(MagicSchool)
export class MagicSchoolResolver {
  @Query(() => [MagicSchool], {
    description: 'Gets all magic schools, optionally filtered by name and sorted by name.'
  })
  async magicSchools(@Args() args: MagicSchoolArgs): Promise<MagicSchool[]> {
    const validatedArgs = MagicSchoolArgsSchema.parse(args)
    const query = MagicSchoolModel.find()

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

  @Query(() => MagicSchool, {
    nullable: true,
    description: 'Gets a single magic school by index.'
  })
  async magicSchool(@Arg('index') indexInput: string): Promise<MagicSchool | null> {
    const { index } = MagicSchoolIndexArgsSchema.parse({ index: indexInput })
    return MagicSchoolModel.findOne({ index }).lean()
  }
}
