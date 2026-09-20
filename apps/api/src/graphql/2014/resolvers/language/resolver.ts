import { Resolver } from 'type-graphql'

import { createResolver } from '@/graphql/common/createResolver'
import { inFilter, regexFilter } from '@/graphql/common/filters'
import LanguageModel, { Language } from '@/models/2014/language'

import { LanguageArgs, LanguageArgsSchema } from './args'

@Resolver(Language)
export class LanguageResolver extends createResolver({
  Type: Language,
  Model: LanguageModel,
  typeName: 'Language',
  singular: 'language',
  plural: 'languages',
  descriptions: {
    fields: 'Fields to sort Languages by',
    order: 'Specify sorting order for languages.',
    list: 'Gets all languages, optionally filtered and sorted.',
    single: 'Gets a single language by its index.'
  },
  orderFields: {
    NAME: { value: 'name', path: 'name' },
    TYPE: { value: 'type', path: 'type' },
    SCRIPT: { value: 'script', path: 'script' }
  },
  defaultSort: 'NAME',
  Args: LanguageArgs,
  argsSchema: LanguageArgsSchema,
  filters: (a) => [
    regexFilter('name', a.name),
    regexFilter('type', a.type),
    inFilter('script', a.script)
  ]
}) {}
