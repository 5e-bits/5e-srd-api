import { Resolver, Query, Arg, Args, registerEnumType } from 'type-graphql'
import LanguageModel, { Language } from '@/models/2014/language'
import { escapeRegExp } from '@/util'
import { buildMongoSortQuery } from '@/graphql/2014/common/inputs'
import {
  LanguageArgs,
  LanguageArgsSchema,
  LanguageIndexArgsSchema,
  LanguageOrderField,
  LANGUAGE_SORT_FIELD_MAP
} from './args'

registerEnumType(LanguageOrderField, {
  name: 'LanguageOrderField',
  description: 'Fields to sort Languages by'
})

@Resolver(Language)
export class LanguageResolver {
  @Query(() => Language, { nullable: true, description: 'Gets a single language by its index.' })
  async language(@Arg('index', () => String) indexInput: string): Promise<Language | null> {
    const { index } = LanguageIndexArgsSchema.parse({ index: indexInput })
    return LanguageModel.findOne({ index }).lean()
  }

  @Query(() => [Language], { description: 'Gets all languages, optionally filtered and sorted.' })
  async languages(@Args() args: LanguageArgs): Promise<Language[]> {
    const validatedArgs = LanguageArgsSchema.parse(args)

    const query = LanguageModel.find()
    const filters: any[] = []

    if (validatedArgs.name) {
      filters.push({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    if (validatedArgs.type) {
      filters.push({ type: validatedArgs.type })
    }

    if (validatedArgs.script && validatedArgs.script.length > 0) {
      filters.push({ script: { $in: validatedArgs.script } })
    }

    if (filters.length > 0) {
      query.where({ $and: filters })
    }

    const sortQuery = buildMongoSortQuery({
      orderBy: validatedArgs.order_by,
      orderDirection: validatedArgs.order_direction,
      sortFieldMap: LANGUAGE_SORT_FIELD_MAP,
      defaultSortField: LanguageOrderField.NAME
    })
    if (sortQuery) {
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
