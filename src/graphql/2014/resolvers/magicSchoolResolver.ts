import { Resolver, Query, Arg, Args } from 'type-graphql'
import { MagicSchool } from '@/models/2014/magicSchool'
import MagicSchoolModel from '@/models/2014/magicSchool'
import { BaseResolver } from '@/graphql/common/resolvers/BaseResolver'
import { NameSortArgs } from '@/graphql/common/args/NameSortArgs'

@Resolver(MagicSchool)
export class MagicSchoolResolver extends BaseResolver<MagicSchool> {
  constructor() {
    super(MagicSchoolModel, MagicSchool)
  }

  @Query(() => MagicSchool, {
    nullable: true,
    description: 'Gets a single school of magic by index.'
  })
  async magicSchool(@Arg('index', () => String) index: string): Promise<MagicSchool | null> {
    return this._findOneByIndex(index)
  }

  @Query(() => [MagicSchool], {
    description: 'Gets all schools of magic, optionally filtered and sorted.'
  })
  async magicSchools(@Args(() => NameSortArgs) args: NameSortArgs): Promise<MagicSchool[]> {
    return this._find(args)
  }
}
