import { Arg, Args, FieldResolver, Query, Resolver, Root } from 'type-graphql'

import { buildSortPipeline } from '@/graphql/2014/common/args'
import { LanguageChoice } from '@/graphql/2014/common/choiceTypes'
import {
  resolveLanguageChoice,
  resolveMultipleReferences,
  resolveSingleReference} from '@/graphql/2014/utils/resolvers'
import AbilityScoreModel, { AbilityScore } from '@/models/2014/abilityScore'
import { Choice } from '@/models/2014/common/choice'
import LanguageModel, { Language } from '@/models/2014/language'
import ProficiencyModel, { Proficiency } from '@/models/2014/proficiency'
import RaceModel, { Race } from '@/models/2014/race'
import SubraceModel, { Subrace, SubraceAbilityBonus } from '@/models/2014/subrace'
import TraitModel, { Trait } from '@/models/2014/trait'
import { escapeRegExp } from '@/util'

import {
  SUBRACE_SORT_FIELD_MAP,
  SubraceArgs,
  SubraceArgsSchema,
  SubraceIndexArgsSchema,
  SubraceOrderField} from './args'

@Resolver(Subrace)
export class SubraceResolver {
  @Query(() => [Subrace], {
    description: 'Gets all subraces, optionally filtered by name and sorted by name.'
  })
  async subraces(@Args(() => SubraceArgs) args: SubraceArgs): Promise<Subrace[]> {
    const validatedArgs = SubraceArgsSchema.parse(args)
    const query = SubraceModel.find()

    if (validatedArgs.name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    const sortQuery = buildSortPipeline<SubraceOrderField>({
      order: validatedArgs.order,
      sortFieldMap: SUBRACE_SORT_FIELD_MAP,
      defaultSortField: SubraceOrderField.NAME
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

  @Query(() => Subrace, { nullable: true, description: 'Gets a single subrace by index.' })
  async subrace(@Arg('index', () => String) indexInput: string): Promise<Subrace | null> {
    const { index } = SubraceIndexArgsSchema.parse({ index: indexInput })
    return SubraceModel.findOne({ index }).lean()
  }

  @FieldResolver(() => Race, { nullable: true })
  async race(@Root() subrace: Subrace): Promise<Race | null> {
    return resolveSingleReference(subrace.race, RaceModel)
  }

  @FieldResolver(() => [Language], { nullable: true })
  async languages(@Root() subrace: Subrace): Promise<Language[]> {
    return resolveMultipleReferences(subrace.languages, LanguageModel)
  }

  @FieldResolver(() => [Trait], { nullable: true })
  async racial_traits(@Root() subrace: Subrace): Promise<Trait[]> {
    return resolveMultipleReferences(subrace.racial_traits, TraitModel)
  }

  @FieldResolver(() => [Proficiency], { nullable: true })
  async starting_proficiencies(@Root() subrace: Subrace): Promise<Proficiency[]> {
    return resolveMultipleReferences(subrace.starting_proficiencies, ProficiencyModel)
  }

  @FieldResolver(() => LanguageChoice, { nullable: true })
  async language_options(@Root() subrace: Subrace): Promise<LanguageChoice | null> {
    return resolveLanguageChoice(subrace.language_options as Choice)
  }
}
@Resolver(SubraceAbilityBonus)
export class SubraceAbilityBonusResolver {
  @FieldResolver(() => AbilityScore, { nullable: true })
  async ability_score(
    @Root() subraceAbilityBonus: SubraceAbilityBonus
  ): Promise<AbilityScore | null> {
    return resolveSingleReference(subraceAbilityBonus.ability_score, AbilityScoreModel)
  }
}
