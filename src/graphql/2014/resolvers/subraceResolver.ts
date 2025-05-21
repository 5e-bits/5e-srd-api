import { Resolver, Query, Arg, Args, ArgsType, Field, FieldResolver, Root, Int } from 'type-graphql'
import { z } from 'zod'
import SubraceModel, { Subrace, SubraceAbilityBonus } from '@/models/2014/subrace'
import { OrderByDirection } from '@/graphql/2014/common/enums'
import { escapeRegExp } from '@/util'
import RaceModel, { Race } from '@/models/2014/race'
import TraitModel, { Trait } from '@/models/2014/trait'
import LanguageModel, { Language } from '@/models/2014/language'
import ProficiencyModel, { Proficiency } from '@/models/2014/proficiency'
import AbilityScoreModel, { AbilityScore } from '@/models/2014/abilityScore'
import {
  resolveMultipleReferences,
  resolveSingleReference,
  resolveLanguageChoice
} from '@/graphql/2014/utils/resolvers'
import { LanguageChoice } from '@/graphql/2014/common/choiceTypes'
import { Choice } from '@/models/2014/common/choice'
import { buildMongoSortQuery } from '@/graphql/2014/common/inputs'
import { BasePaginationArgs, BasePaginationArgsSchema } from '../common/args'

const SubraceArgsSchema = z
  .object({
    name: z.string().optional(),
    order_direction: z.nativeEnum(OrderByDirection).optional().default(OrderByDirection.ASC)
  })
  .merge(BasePaginationArgsSchema)

const SubraceIndexArgsSchema = z.object({
  index: z.string().min(1, { message: 'Index must be a non-empty string' })
})

@ArgsType()
class SubraceArgs extends BasePaginationArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by subrace name (case-insensitive, partial match)'
  })
  name?: string

  @Field(() => OrderByDirection, {
    nullable: true,
    description: 'Sort direction (default: ASC)'
  })
  order_direction?: OrderByDirection
}

@Resolver(Subrace)
export class SubraceResolver {
  @Query(() => [Subrace], {
    description: 'Gets all subraces, optionally filtered by name and sorted by name.'
  })
  async subraces(@Args() args: SubraceArgs): Promise<Subrace[]> {
    const validatedArgs = SubraceArgsSchema.parse(args)
    const query = SubraceModel.find()

    if (validatedArgs.name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    const sortQuery = buildMongoSortQuery({
      orderDirection: validatedArgs.order_direction,
      defaultSortField: 'name'
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

  @Query(() => Subrace, { nullable: true, description: 'Gets a single subrace by index.' })
  async subrace(@Arg('index') indexInput: string): Promise<Subrace | null> {
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
