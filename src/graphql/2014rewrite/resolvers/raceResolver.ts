import { Resolver, Query, Arg, Args, ArgsType, Field, FieldResolver, Root } from 'type-graphql'
import { IsOptional, IsString, IsEnum } from 'class-validator'
import RaceModel, { Race, RaceAbilityBonus } from '@/models/2014/race'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { escapeRegExp } from '@/util'
import AbilityScoreModel, { AbilityScore } from '@/models/2014/abilityScore'
import LanguageModel, { Language } from '@/models/2014/language'
import ProficiencyModel, { Proficiency } from '@/models/2014/proficiency'
import SubraceModel, { Subrace } from '@/models/2014/subrace'
import TraitModel, { Trait } from '@/models/2014/trait'
import {
  resolveMultipleReferences,
  resolveSingleReference,
  resolveLanguageChoice
} from '@/graphql/2014rewrite/utils/resolvers'
import { LanguageChoice } from '../common/types'
import { Choice } from '@/models/2014/common'

@ArgsType()
class RaceArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by race name (case-insensitive, partial match)'
  })
  @IsOptional()
  @IsString()
  name?: string

  @Field(() => OrderByDirection, {
    nullable: true,
    defaultValue: OrderByDirection.ASC,
    description: 'Sort direction for the name field (default: ASC)'
  })
  @IsOptional()
  @IsEnum(OrderByDirection)
  order_direction?: OrderByDirection
}

@Resolver(Race)
export class RaceResolver {
  @Query(() => [Race], { description: 'Gets all races, optionally filtered by name and sorted.' })
  async races(@Args() { name, order_direction }: RaceArgs): Promise<Race[]> {
    const query = RaceModel.find()

    if (name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
    }

    if (order_direction) {
      query.sort({ name: order_direction === OrderByDirection.DESC ? -1 : 1 })
    }

    return query.lean()
  }

  @Query(() => Race, { nullable: true, description: 'Gets a single race by its index.' })
  async race(@Arg('index', () => String) index: string): Promise<Race | null> {
    return RaceModel.findOne({ index }).lean()
  }

  @FieldResolver(() => [Language], { nullable: true })
  async languages(@Root() race: Race): Promise<Language[]> {
    return resolveMultipleReferences(race.languages, LanguageModel)
  }

  @FieldResolver(() => [Proficiency], { nullable: true })
  async starting_proficiencies(@Root() race: Race): Promise<Proficiency[]> {
    return resolveMultipleReferences(race.starting_proficiencies, ProficiencyModel)
  }

  @FieldResolver(() => [Subrace], { nullable: true })
  async subraces(@Root() race: Race): Promise<Subrace[]> {
    return resolveMultipleReferences(race.subraces, SubraceModel)
  }

  @FieldResolver(() => [Trait], { nullable: true })
  async traits(@Root() race: Race): Promise<Trait[]> {
    return resolveMultipleReferences(race.traits, TraitModel)
  }

  @FieldResolver(() => LanguageChoice, { nullable: true })
  async language_options(@Root() race: Race): Promise<LanguageChoice | null> {
    return resolveLanguageChoice(race.language_options as Choice)
  }
}

@Resolver(RaceAbilityBonus)
export class RaceAbilityBonusResolver {
  @FieldResolver(() => AbilityScore, { nullable: true })
  async ability_score(@Root() raceAbilityBonus: RaceAbilityBonus): Promise<AbilityScore | null> {
    return resolveSingleReference(raceAbilityBonus.ability_score, AbilityScoreModel)
  }
}
