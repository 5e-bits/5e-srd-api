import { Resolver, Query, Arg, Args, FieldResolver, Root } from 'type-graphql'
import { AbilityScore } from '@/models/2014/abilityScore'
import AbilityScoreModel from '@/models/2014/abilityScore'
import { Skill } from '@/models/2014/skill'
import SkillModel from '@/models/2014/skill'
import { BaseResolver } from '@/graphql/common/resolvers/BaseResolver'
import { AbilityScoreArgs } from '../args/AbilityScoreArgs' // Import new args type
import { FilterQuery } from 'mongoose'
import { OrderByDirection } from '@/graphql/common/enums'

@Resolver(AbilityScore)
export class AbilityScoreResolver extends BaseResolver<AbilityScore> {
  constructor() {
    super(AbilityScoreModel, AbilityScore)
  }

  @Query(() => AbilityScore, {
    nullable: true,
    description: 'Gets a single ability score by index (e.g., str, dex).'
  })
  async abilityScore(@Arg('index', () => String) index: string): Promise<AbilityScore | null> {
    return this._findOneByIndex(index)
  }

  @Query(() => [AbilityScore], {
    description:
      'Gets all ability scores, optionally filtered by name/full_name and sorted by name.'
  })
  async abilityScores(
    @Args(() => AbilityScoreArgs) { name, order_direction, full_name }: AbilityScoreArgs
  ): Promise<AbilityScore[]> {
    // Start with potential filters
    const filter: FilterQuery<AbilityScore> = {}
    if (name !== undefined) {
      // BaseResolver filters by name (abbreviation, e.g., STR)
      filter.name = { $regex: new RegExp(name, 'i') }
    }
    if (full_name !== undefined) {
      filter.full_name = { $regex: new RegExp(full_name, 'i') }
    }

    // Determine sort order (still sorts by name/abbreviation)
    const sortOrder = order_direction === OrderByDirection.DESC ? -1 : 1

    // Execute query with filters and sorting
    return AbilityScoreModel.find(filter).sort({ name: sortOrder }).lean()
  }

  // Field resolver for the 'skills' field on AbilityScore
  @FieldResolver(() => [Skill], { description: 'Skills associated with this ability score.' })
  async skills(@Root() abilityScore: AbilityScore): Promise<Skill[]> {
    // Find skills where the ability_score reference index matches the parent ability score index
    // We query the SkillModel here
    return SkillModel.find({ 'ability_score.index': abilityScore.index }).lean()
  }
}
