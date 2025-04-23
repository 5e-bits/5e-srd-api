import { Resolver, Query, Arg, Args } from 'type-graphql'
import { Language } from '@/models/2014/language'
import LanguageModel from '@/models/2014/language'
import { BaseResolver } from '@/graphql/common/resolvers/BaseResolver'
import { NameSortArgs } from '@/graphql/common/args/NameSortArgs'

@Resolver(Language)
export class LanguageResolver extends BaseResolver<Language> {
  constructor() {
    super(LanguageModel, Language)
  }

  @Query(() => Language, {
    nullable: true,
    description: 'Gets a single language by index.'
  })
  async language(@Arg('index', () => String) index: string): Promise<Language | null> {
    return this._findOneByIndex(index)
  }

  @Query(() => [Language], {
    description: 'Gets all languages, optionally filtered and sorted.'
  })
  async languages(@Args(() => NameSortArgs) args: NameSortArgs): Promise<Language[]> {
    return this._find(args)
  }
}
