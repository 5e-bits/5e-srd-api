import { Resolver, Query, Arg, Args, ArgsType, Field, FieldResolver, Root } from 'type-graphql'
import SubraceModel, { Subrace, SubraceAbilityBonus } from '@/models/2014/subrace'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { IsOptional, IsString, IsEnum } from 'class-validator'
import { escapeRegExp } from '@/util'
import RaceModel, { Race } from '@/models/2014/race'
import TraitModel, { Trait } from '@/models/2014/trait'
import LanguageModel, { Language } from '@/models/2014/language'
import ProficiencyModel, { Proficiency } from '@/models/2014/proficiency'
import AbilityScoreModel, { AbilityScore } from '@/models/2014/abilityScore'
import {
  resolveMultipleReferences,
  resolveSingleReference
} from '@/graphql/2014rewrite/utils/resolvers'

@ArgsType()
class SubraceArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by subrace name (case-insensitive, partial match)'
  })
  @IsOptional()
  @IsString()
  name?: string

  @Field(() => OrderByDirection, {
    nullable: true,
    defaultValue: OrderByDirection.ASC,
    description: 'Sort direction (default: ASC)'
  })
  @IsOptional()
  @IsEnum(OrderByDirection)
  order_direction?: OrderByDirection
}

@Resolver(Subrace)
export class SubraceResolver {
  @Query(() => [Subrace], {
    description: 'Gets all subraces, optionally filtered by name and sorted by name.'
  })
  async subraces(@Args() { name, order_direction }: SubraceArgs): Promise<Subrace[]> {
    const query = SubraceModel.find()

    if (name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
    }

    if (order_direction) {
      query.sort({ name: order_direction === OrderByDirection.DESC ? -1 : 1 })
    }

    // FieldResolvers will be added in Pass 3.
    return query.lean()
  }

  @Query(() => Subrace, { nullable: true, description: 'Gets a single subrace by index.' })
  async subrace(@Arg('index', () => String) index: string): Promise<Subrace | null> {
    // Note: .lean() is used, reference/choice fields will contain raw data.
    // FieldResolvers needed in Pass 3.
    return SubraceModel.findOne({ index }).lean()
  }

  // Field Resolver for choices (language_options) will be added in Pass 3

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
}

// Separate resolver for nested SubraceAbilityBonus type
@Resolver(SubraceAbilityBonus)
export class SubraceAbilityBonusResolver {
  @FieldResolver(() => AbilityScore, { nullable: true })
  async ability_score(
    @Root() subraceAbilityBonus: SubraceAbilityBonus
  ): Promise<AbilityScore | null> {
    return resolveSingleReference(subraceAbilityBonus.ability_score, AbilityScoreModel)
  }
}
