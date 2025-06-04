import { Arg, Args, Query, Resolver } from 'type-graphql'

import { buildSortPipeline } from '@/graphql/common/args'
import DamageTypeModel, { DamageType } from '@/models/2014/damageType'
import { escapeRegExp } from '@/util'

import {
  DAMAGE_TYPE_SORT_FIELD_MAP,
  DamageTypeArgs,
  DamageTypeArgsSchema,
  DamageTypeIndexArgsSchema,
  DamageTypeOrderField
} from './args'

@Resolver(DamageType)
export class DamageTypeResolver {
  @Query(() => [DamageType], {
    description: 'Gets all damage types, optionally filtered by name and sorted by name.'
  })
  async damageTypes(@Args(() => DamageTypeArgs) args: DamageTypeArgs): Promise<DamageType[]> {
    const validatedArgs = DamageTypeArgsSchema.parse(args)
    const query = DamageTypeModel.find()

    if (validatedArgs.name != null && validatedArgs.name !== '') {
      query.where({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    const sortQuery = buildSortPipeline<DamageTypeOrderField>({
      order: validatedArgs.order,
      sortFieldMap: DAMAGE_TYPE_SORT_FIELD_MAP,
      defaultSortField: DamageTypeOrderField.NAME
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

  @Query(() => DamageType, { nullable: true, description: 'Gets a single damage type by index.' })
  async damageType(@Arg('index', () => String) indexInput: string): Promise<DamageType | null> {
    const { index } = DamageTypeIndexArgsSchema.parse({ index: indexInput })
    return DamageTypeModel.findOne({ index }).lean()
  }
}
