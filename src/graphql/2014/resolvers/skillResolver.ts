import { Resolver, Query, Arg, Args, FieldResolver, Root } from 'type-graphql'
import { Skill } from '@/models/2014/skill'
import SkillModel from '@/models/2014/skill'
import { AbilityScore } from '@/models/2014/abilityScore'
import AbilityScoreModel from '@/models/2014/abilityScore'
import { BaseResolver } from '@/graphql/common/resolvers/BaseResolver'
import { SkillArgs } from '../args/SkillArgs'
import { FilterQuery } from 'mongoose'
import { OrderByDirection } from '@/graphql/common/enums'

@Resolver(Skill)
export class SkillResolver extends BaseResolver<Skill> {
  constructor() {
    super(SkillModel, Skill)
  }

  @Query(() => Skill, {
    nullable: true,
    description: 'Gets a single skill by index (e.g., athletics).'
  })
  async skill(@Arg('index', () => String) index: string): Promise<Skill | null> {
    return this._findOneByIndex(index)
  }

  @Query(() => [Skill], {
    description: 'Gets all skills, optionally filtered by name/ability_score and sorted by name.'
  })
  async skills(
    @Args(() => SkillArgs) { name, order_direction, ability_score }: SkillArgs
  ): Promise<Skill[]> {
    // Start with potential filters
    const filter: FilterQuery<Skill> = {}
    if (name !== undefined) {
      filter.name = { $regex: new RegExp(name, 'i') }
    }
    if (ability_score !== undefined) {
      filter['ability_score.index'] = ability_score // Filter by referenced ability score index
    }

    // Determine sort order
    const sortOrder = order_direction === OrderByDirection.DESC ? -1 : 1

    // Execute query with filters and sorting
    return SkillModel.find(filter).sort({ name: sortOrder }).lean()
  }

  // Field resolver for the 'ability_score' field on Skill
  @FieldResolver(() => AbilityScore, {
    description: 'The ability score associated with this skill.'
  })
  async ability_score(@Root() skill: Skill): Promise<AbilityScore | null> {
    // Find the AbilityScore whose index matches the one referenced in the skill
    // We query the AbilityScoreModel here
    if (!skill.ability_score?.index) {
      // Handle cases where the reference might be missing (shouldn't happen with required: true)
      return null
    }
    return AbilityScoreModel.findOne({ index: skill.ability_score.index }).lean()
  }
}
