import { Resolver, Query, Arg, Args, ArgsType, Field, FieldResolver, Root } from 'type-graphql'
import TraitModel, { ActionDamage, Trait, TraitSpecific } from '@/models/2014/trait'
import { TraitChoice, SpellChoice } from '@/graphql/2014rewrite/types/traitTypes'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { IsOptional, IsString, IsEnum } from 'class-validator'
import { escapeRegExp } from '@/util'
import RaceModel, { Race } from '@/models/2014/race'
import SubraceModel, { Subrace } from '@/models/2014/subrace'
import ProficiencyModel, { Proficiency } from '@/models/2014/proficiency'
import DamageTypeModel, { DamageType } from '@/models/2014/damageType'
import {
  resolveMultipleReferences,
  resolveSingleReference,
  resolveLanguageChoice,
  resolveTraitChoice,
  resolveSpellChoice,
  resolveProficiencyChoice
} from '@/graphql/2014rewrite/utils/resolvers'
import { LanguageChoice, LevelValue, ProficiencyChoice } from '@/graphql/2014rewrite/common/types'
import { mapLevelObjectToArray } from '@/graphql/2014rewrite/utils/helpers'
import { Choice } from '@/models/2014/common'

@ArgsType()
class TraitArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by trait name (case-insensitive, partial match)'
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

@Resolver(Trait)
export class TraitResolver {
  @Query(() => [Trait], {
    description: 'Gets all traits, optionally filtered by name and sorted by name.'
  })
  async traits(@Args() { name, order_direction }: TraitArgs): Promise<Trait[]> {
    const query = TraitModel.find()

    if (name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
    }

    if (order_direction) {
      query.sort({ name: order_direction === OrderByDirection.DESC ? -1 : 1 })
    }

    // Note: .lean() is used, so reference/choice fields will contain raw data
    // FieldResolvers will be added in Pass 3.
    return query.lean()
  }

  @Query(() => Trait, { nullable: true, description: 'Gets a single trait by index.' })
  async trait(@Arg('index', () => String) index: string): Promise<Trait | null> {
    // FieldResolvers needed in Pass 3.
    return TraitModel.findOne({ index }).lean()
  }

  @FieldResolver(() => [Proficiency], { nullable: true })
  async proficiencies(@Root() trait: Trait): Promise<Proficiency[]> {
    return resolveMultipleReferences(trait.proficiencies, ProficiencyModel)
  }

  @FieldResolver(() => [Race], { nullable: true })
  async races(@Root() trait: Trait): Promise<Race[]> {
    return resolveMultipleReferences(trait.races, RaceModel)
  }

  @FieldResolver(() => [Subrace], { nullable: true })
  async subraces(@Root() trait: Trait): Promise<Subrace[]> {
    return resolveMultipleReferences(trait.subraces, SubraceModel)
  }

  @FieldResolver(() => Trait, { nullable: true })
  async parent(@Root() trait: Trait): Promise<Trait | null> {
    return resolveSingleReference(trait.parent, TraitModel)
  }

  @FieldResolver(() => LanguageChoice, { nullable: true })
  async language_options(@Root() trait: Trait): Promise<LanguageChoice | null> {
    return resolveLanguageChoice(trait.language_options as Choice)
  }

  @FieldResolver(() => ProficiencyChoice, { nullable: true })
  async proficiency_choices(@Root() trait: Trait): Promise<ProficiencyChoice | null> {
    return resolveProficiencyChoice(trait.proficiency_choices)
  }
}

// Separate resolver for nested TraitSpecific type
@Resolver(TraitSpecific)
export class TraitSpecificResolver {
  @FieldResolver(() => DamageType, { nullable: true })
  async damage_type(@Root() traitSpecific: TraitSpecific): Promise<DamageType | null> {
    return resolveSingleReference(traitSpecific.damage_type, DamageTypeModel)
  }

  @FieldResolver(() => TraitChoice, { nullable: true })
  async subtrait_options(@Root() traitSpecific: TraitSpecific) {
    return resolveTraitChoice(traitSpecific.subtrait_options)
  }

  @FieldResolver(() => SpellChoice, { nullable: true })
  async spell_options(@Root() traitSpecific: TraitSpecific) {
    return resolveSpellChoice(traitSpecific.spell_options)
  }
}

@Resolver(ActionDamage)
export class ActionDamageResolver {
  @FieldResolver(() => [LevelValue], {
    nullable: true,
    description: 'Damage scaling based on character level, transformed from the raw data object.'
  })
  async damage_at_character_level(
    @Root() actionDamage: ActionDamage
  ): Promise<LevelValue[] | null> {
    return mapLevelObjectToArray(actionDamage.damage_at_character_level)
  }
}
