import { Arg, Args, FieldResolver, Query, Resolver, Root } from 'type-graphql'

import { buildSortPipeline } from '@/graphql/common/args'
import { resolveMultipleReferences } from '@/graphql/utils/resolvers'
import BackgroundModel, { Background2024 } from '@/models/2024/background'
import ProficiencyModel, { Proficiency2024 } from '@/models/2024/proficiency'
import { escapeRegExp } from '@/util'

import {
  PROFICIENCY_SORT_FIELD_MAP,
  ProficiencyArgs,
  ProficiencyArgsSchema,
  ProficiencyIndexArgsSchema,
  ProficiencyOrderField
} from './args'

@Resolver(Proficiency2024)
export class ProficiencyResolver {
  @Query(() => [Proficiency2024], {
    description: 'Gets all proficiencies, optionally filtered by name and type.'
  })
  async proficiencies(
    @Args(() => ProficiencyArgs) args: ProficiencyArgs
  ): Promise<Proficiency2024[]> {
    const validatedArgs = ProficiencyArgsSchema.parse(args)

    const query = ProficiencyModel.find()
    const filters: any[] = []

    if (validatedArgs.name != null && validatedArgs.name !== '') {
      filters.push({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    if (validatedArgs.type && validatedArgs.type.length > 0) {
      filters.push({ type: { $in: validatedArgs.type } })
    }

    if (filters.length > 0) {
      query.where({ $and: filters })
    }

    const sortQuery = buildSortPipeline<ProficiencyOrderField>({
      order: validatedArgs.order,
      sortFieldMap: PROFICIENCY_SORT_FIELD_MAP,
      defaultSortField: ProficiencyOrderField.NAME
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

  @Query(() => Proficiency2024, {
    nullable: true,
    description: 'Gets a single proficiency by index.'
  })
  async proficiency(
    @Arg('index', () => String) indexInput: string
  ): Promise<Proficiency2024 | null> {
    const { index } = ProficiencyIndexArgsSchema.parse({ index: indexInput })
    return ProficiencyModel.findOne({ index }).lean()
  }

  @FieldResolver(() => [Background2024])
  async backgrounds(@Root() proficiency: Proficiency2024): Promise<Background2024[]> {
    return resolveMultipleReferences(proficiency.backgrounds, BackgroundModel)
  }
}
