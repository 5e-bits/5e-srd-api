import { Resolver, Query, Arg, Args } from 'type-graphql'
import { Alignment } from '@/models/2014/alignment'
import AlignmentModel from '@/models/2014/alignment'
import { BaseResolver } from '@/graphql/common/resolvers/BaseResolver'
import { NameSortArgs } from '@/graphql/common/args/NameSortArgs'

@Resolver(Alignment)
export class AlignmentResolver extends BaseResolver<Alignment> {
  constructor() {
    // Pass the Typegoose model and the GraphQL ObjectType class to the base constructor
    super(AlignmentModel, Alignment)
  }

  @Query(() => Alignment, {
    nullable: true,
    description: 'Gets a single alignment by index.'
  })
  async alignment(@Arg('index', () => String) index: string): Promise<Alignment | null> {
    return this._findOneByIndex(index)
  }

  @Query(() => [Alignment], {
    description: 'Gets all alignments, optionally filtered and sorted.'
  })
  async alignments(@Args(() => NameSortArgs) args: NameSortArgs): Promise<Alignment[]> {
    return this._find(args)
  }
}
