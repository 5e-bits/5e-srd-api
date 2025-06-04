import { Arg, Args, FieldResolver, Query, Resolver, Root } from 'type-graphql'

import { LanguageChoice, ProficiencyChoice } from '@/graphql/2014/common/choiceTypes'
import {
  SpellChoice,
  SpellChoiceOption,
  SpellChoiceOptionSet,
  TraitChoice,
  TraitChoiceOption,
  TraitChoiceOptionSet
} from '@/graphql/2014/types/traitTypes'
import { mapLevelObjectToArray } from '@/graphql/2014/utils/helpers'
import { resolveLanguageChoice, resolveProficiencyChoice } from '@/graphql/2014/utils/resolvers'
import { buildSortPipeline } from '@/graphql/common/args'
import { LevelValue } from '@/graphql/common/types'
import {
  resolveMultipleReferences,
  resolveSingleReference,
  resolveReferenceOptionArray
} from '@/graphql/utils/resolvers'
import DamageTypeModel, { DamageType } from '@/models/2014/damageType'
import ProficiencyModel, { Proficiency } from '@/models/2014/proficiency'
import RaceModel, { Race } from '@/models/2014/race'
import SpellModel from '@/models/2014/spell'
import SubraceModel, { Subrace } from '@/models/2014/subrace'
import TraitModel, { ActionDamage, Trait, TraitSpecific } from '@/models/2014/trait'
import { Choice, OptionsArrayOptionSet } from '@/models/common/choice'
import { escapeRegExp } from '@/util'

import {
  TRAIT_SORT_FIELD_MAP,
  TraitArgs,
  TraitArgsSchema,
  TraitIndexArgsSchema,
  TraitOrderField
} from './args'

@Resolver(Trait)
export class TraitResolver {
  @Query(() => [Trait], {
    description: 'Gets all traits, optionally filtered by name and sorted by name.'
  })
  async traits(@Args(() => TraitArgs) args: TraitArgs): Promise<Trait[]> {
    const validatedArgs = TraitArgsSchema.parse(args)
    const query = TraitModel.find()

    if (validatedArgs.name != null && validatedArgs.name !== '') {
      query.where({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    const sortQuery = buildSortPipeline<TraitOrderField>({
      order: validatedArgs.order,
      sortFieldMap: TRAIT_SORT_FIELD_MAP,
      defaultSortField: TraitOrderField.NAME
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

  @Query(() => Trait, { nullable: true, description: 'Gets a single trait by index.' })
  async trait(@Arg('index', () => String) indexInput: string): Promise<Trait | null> {
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

async function resolveTraitChoice(
  choiceData: Choice | undefined | null
): Promise<TraitChoice | null> {
  if (!choiceData) {
    return null
  }

  const optionsArraySet = choiceData.from as OptionsArrayOptionSet
  const gqlEmbeddedOptions = await resolveReferenceOptionArray(
    optionsArraySet,
    TraitModel,
    (item, optionType) => ({ option_type: optionType, item }) as TraitChoiceOption
  )

  const gqlOptionSet: TraitChoiceOptionSet = {
    option_set_type: choiceData.from.option_set_type,
    options: gqlEmbeddedOptions
  }

  return {
    choose: choiceData.choose,
    type: choiceData.type,
    from: gqlOptionSet
  }
}

async function resolveSpellChoice(
  choiceData: Choice | undefined | null
): Promise<SpellChoice | null> {
  if (!choiceData) {
    return null
  }

  const optionsArraySet = choiceData.from as OptionsArrayOptionSet
  const gqlEmbeddedOptions = await resolveReferenceOptionArray(
    optionsArraySet,
    SpellModel,
    (item, optionType) => ({ option_type: optionType, item }) as SpellChoiceOption
  )

  const gqlOptionSet: SpellChoiceOptionSet = {
    option_set_type: choiceData.from.option_set_type,
    options: gqlEmbeddedOptions
  }

  return {
    choose: choiceData.choose,
    type: choiceData.type,
    from: gqlOptionSet
  }
}
