import { Resolver, Query, Arg, Args, FieldResolver, Root } from 'type-graphql'
import { Feat, Prerequisite } from '@/models/2014/feat'
import FeatModel from '@/models/2014/feat'
import { AbilityScore } from '@/models/2014/abilityScore'
import AbilityScoreModel from '@/models/2014/abilityScore'
import { BaseResolver } from '@/graphql/common/resolvers/BaseResolver'
import { NameSortArgs } from '@/graphql/common/args/NameSortArgs'

@Resolver(Feat)
export class FeatResolver extends BaseResolver<Feat> {
  constructor() {
    super(FeatModel, Feat)
  }

  @Query(() => Feat, {
    nullable: true,
    description: 'Gets a single feat by index (e.g., grappler).'
  })
  async feat(@Arg('index', () => String) index: string): Promise<Feat | null> {
    return this._findOneByIndex(index)
  }

  @Query(() => [Feat], {
    description: 'Gets all feats, optionally filtered and sorted.'
  })
  async feats(@Args(() => NameSortArgs) args: NameSortArgs): Promise<Feat[]> {
    return this._find(args)
  }
}

// Separate resolver for the nested Prerequisite type to resolve ability_score
@Resolver(Prerequisite)
export class FeatPrerequisiteResolver {
  @FieldResolver(() => AbilityScore, { description: 'The ability score required.' })
  async ability_score(@Root() prerequisite: Prerequisite): Promise<AbilityScore | null> {
    if (!prerequisite.ability_score?.index) {
      return null // Or handle error appropriately
    }
    // Fetch the AbilityScore document using the index from APIReference
    return AbilityScoreModel.findOne({ index: prerequisite.ability_score.index }).lean()
  }
}
