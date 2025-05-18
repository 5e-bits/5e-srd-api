import { Resolver, Query, Arg, Args, ArgsType, Field, FieldResolver, Root, Int } from 'type-graphql'
import { z } from 'zod'
import TraitModel, { ActionDamage, Trait, TraitSpecific } from '@/models/2014/trait'
import { TraitChoice, SpellChoice } from '@/graphql/2014rewrite/types/traitTypes'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
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
import { LevelValue } from '@/graphql/2014rewrite/common/types'
import { LanguageChoice, ProficiencyChoice } from '@/graphql/2014rewrite/common/choiceTypes'
import { mapLevelObjectToArray } from '@/graphql/2014rewrite/utils/helpers'
import { Choice } from '@/models/2014/common'
import { buildMongoSortQuery } from '@/graphql/2014rewrite/common/inputs'

const TraitArgsSchema = z.object({
  name: z.string().optional(),
  order_direction: z.nativeEnum(OrderByDirection).optional().default(OrderByDirection.ASC),
  skip: z.number().int().min(0).optional(),
  limit: z.number().int().min(1).optional()
})

const TraitIndexArgsSchema = z.object({
  index: z.string().min(1, { message: 'Index must be a non-empty string' })
})

@ArgsType()
class TraitArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by trait name (case-insensitive, partial match)'
  })
  name?: string

  @Field(() => OrderByDirection, {
    nullable: true,
    description: 'Sort direction (default: ASC)'
  })
  order_direction?: OrderByDirection

  @Field(() => Int, { nullable: true, description: 'TODO: Pass 5 - Number of results to skip' })
  skip?: number

  @Field(() => Int, {
    nullable: true,
    description: 'TODO: Pass 5 - Maximum number of results to return'
  })
  limit?: number
}

@Resolver(Trait)
export class TraitResolver {
  @Query(() => [Trait], {
    description: 'Gets all traits, optionally filtered by name and sorted by name.'
  })
  async traits(@Args() args: TraitArgs): Promise<Trait[]> {
    const validatedArgs = TraitArgsSchema.parse(args)
    const query = TraitModel.find()

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

    return query.lean()
  }

  @Query(() => Trait, { nullable: true, description: 'Gets a single trait by index.' })
  async trait(@Arg('index') indexInput: string): Promise<Trait | null> {
    const { index } = TraitIndexArgsSchema.parse({ index: indexInput })
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
