import { Arg, Args, Query, Resolver } from 'type-graphql'

import { buildSortPipeline } from '@/graphql/common/args'
import SubclassModel, { Subclass2024 } from '@/models/2024/subclass'
import { escapeRegExp } from '@/util'

import {
  SUBCLASS_SORT_FIELD_MAP,
  SubclassArgs,
  SubclassArgsSchema,
  SubclassIndexArgsSchema,
  SubclassOrderField
} from './args'

@Resolver(Subclass2024)
export class SubclassResolver {
  @Query(() => [Subclass2024], {
    description: 'Gets all subclasses, optionally filtered by name.'
  })
  async subclasses(@Args(() => SubclassArgs) args: SubclassArgs): Promise<Subclass2024[]> {
    const validatedArgs = SubclassArgsSchema.parse(args)
    const query = SubclassModel.find()

    if (validatedArgs.name != null && validatedArgs.name !== '') {
      query.where({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    const sortQuery = buildSortPipeline<SubclassOrderField>({
      order: validatedArgs.order,
      sortFieldMap: SUBCLASS_SORT_FIELD_MAP,
      defaultSortField: SubclassOrderField.NAME
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

  @Query(() => Subclass2024, {
    nullable: true,
    description: 'Gets a single subclass by index.'
  })
  async subclass(@Arg('index', () => String) indexInput: string): Promise<Subclass2024 | null> {
    const { index } = SubclassIndexArgsSchema.parse({ index: indexInput })
    return SubclassModel.findOne({ index }).lean()
  }
}
