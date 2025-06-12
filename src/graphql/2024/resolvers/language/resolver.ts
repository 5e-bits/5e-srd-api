import { Arg, Args, Query, Resolver } from 'type-graphql'

import { buildSortPipeline } from '@/graphql/common/args'
import LanguageModel, { Language2024 } from '@/models/2024/language'
import { escapeRegExp } from '@/util'

import {
  LANGUAGE_SORT_FIELD_MAP,
  LanguageArgs,
  LanguageArgsSchema,
  LanguageIndexArgsSchema,
  LanguageOrderField
} from './args'

@Resolver(Language2024)
export class LanguageResolver {
  @Query(() => Language2024, {
    nullable: true,
    description: 'Gets a single language by its index.'
  })
  async language(@Arg('index', () => String) indexInput: string): Promise<Language2024 | null> {
    const { index } = LanguageIndexArgsSchema.parse({ index: indexInput })
    return LanguageModel.findOne({ index }).lean()
  }

  @Query(() => [Language2024], {
    description: 'Gets all languages, optionally filtered and sorted.'
  })
  async languages(@Args(() => LanguageArgs) args: LanguageArgs): Promise<Language2024[]> {
    const validatedArgs = LanguageArgsSchema.parse(args)

    const query = LanguageModel.find()
    const filters: any[] = []

    if (validatedArgs.name != null && validatedArgs.name !== '') {
      filters.push({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    if (validatedArgs.type != null && validatedArgs.type !== '') {
      filters.push({ type: { $regex: new RegExp(escapeRegExp(validatedArgs.type), 'i') } })
    }

    if (validatedArgs.script && validatedArgs.script.length > 0) {
      filters.push({ script: { $in: validatedArgs.script } })
    }

    if (filters.length > 0) {
      query.where({ $and: filters })
    }

    const sortQuery = buildSortPipeline<LanguageOrderField>({
      order: validatedArgs.order,
      sortFieldMap: LANGUAGE_SORT_FIELD_MAP,
      defaultSortField: LanguageOrderField.NAME
    })
    if (Object.keys(sortQuery).length > 0) {
      query.sort(sortQuery)
    }

    if (validatedArgs.skip !== undefined) {
      query.skip(validatedArgs.skip)
    }
    if (validatedArgs.limit !== undefined) {
      query.limit(validatedArgs.limit)
    }

    return query.lean()
  }
}
