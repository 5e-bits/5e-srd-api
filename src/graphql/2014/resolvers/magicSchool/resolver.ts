import { Arg, Args, Query, Resolver } from 'type-graphql'

import { buildSortPipeline } from '@/graphql/common/args'
import MagicSchoolModel, { MagicSchool } from '@/models/2014/magicSchool'
import { escapeRegExp } from '@/util'

import {
  MAGIC_SCHOOL_SORT_FIELD_MAP,
  MagicSchoolArgs,
  MagicSchoolArgsSchema,
  MagicSchoolIndexArgsSchema,
  MagicSchoolOrderField
} from './args'

@Resolver(MagicSchool)
export class MagicSchoolResolver {
  @Query(() => [MagicSchool], {
    description: 'Gets all magic schools, optionally filtered by name and sorted by name.'
  })
  async magicSchools(@Args(() => MagicSchoolArgs) args: MagicSchoolArgs): Promise<MagicSchool[]> {
    const validatedArgs = MagicSchoolArgsSchema.parse(args)
    const query = MagicSchoolModel.find()

    if (validatedArgs.name != null && validatedArgs.name !== '') {
      query.where({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    const sortQuery = buildSortPipeline<MagicSchoolOrderField>({
      order: validatedArgs.order,
      sortFieldMap: MAGIC_SCHOOL_SORT_FIELD_MAP,
      defaultSortField: MagicSchoolOrderField.NAME
    })

    if (Object.keys(sortQuery).length > 0) {
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
  async magicSchool(@Arg('index', () => String) indexInput: string): Promise<MagicSchool | null> {
    const { index } = MagicSchoolIndexArgsSchema.parse({ index: indexInput })
    return MagicSchoolModel.findOne({ index }).lean()
  }
}
