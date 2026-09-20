import { FieldResolver, Resolver, Root } from 'type-graphql'

import { LanguageChoice } from '@/graphql/2014/common/choiceTypes'
import {
  IdealChoice,
  IdealOption as ResolvedIdealOption
} from '@/graphql/2014/types/backgroundTypes'
import { StartingEquipmentChoice } from '@/graphql/2014/types/startingEquipment'
import { resolveLanguageChoice } from '@/graphql/2014/utils/resolvers'
import { resolveStartingEquipmentChoices } from '@/graphql/2014/utils/startingEquipmentResolver'
import { StringChoice } from '@/graphql/common/choiceTypes'
import { createResolver } from '@/graphql/common/createResolver'
import {
  resolveMultipleReferences,
  resolveSingleReference,
  resolveStringChoice
} from '@/graphql/utils/resolvers'
import AlignmentModel, { Alignment } from '@/models/2014/alignment'
import BackgroundModel, { Background, EquipmentRef } from '@/models/2014/background'
import EquipmentModel, { Equipment } from '@/models/2014/equipment'
import ProficiencyModel, { Proficiency } from '@/models/2014/proficiency'
import { Choice, IdealOption, OptionsArrayOptionSet } from '@/models/common/choice'

@Resolver(Background)
export class BackgroundResolver extends createResolver({
  Type: Background,
  Model: BackgroundModel,
  typeName: 'Background',
  singular: 'background',
  plural: 'backgrounds',
  descriptions: {
    fields: 'Fields to sort Backgrounds by',
    order: 'Specify sorting order for backgrounds.',
    list: 'Gets all backgrounds, optionally filtered by name and sorted by name.',
    single: 'Gets a single background by index.'
  }
}) {
  @FieldResolver(() => [Proficiency], { nullable: true })
  async starting_proficiencies(@Root() background: Background): Promise<Proficiency[]> {
    return resolveMultipleReferences(background.starting_proficiencies, ProficiencyModel)
  }

  @FieldResolver(() => StringChoice, {
    nullable: true,
    description: 'Resolves the flaws choice for the background.'
  })
  async flaws(@Root() background: Background): Promise<StringChoice | null> {
    return resolveStringChoice(background.flaws as Choice)
  }

  @FieldResolver(() => StringChoice, {
    nullable: true,
    description: 'Resolves the bonds choice for the background.'
  })
  async bonds(@Root() background: Background): Promise<StringChoice | null> {
    return resolveStringChoice(background.bonds as Choice)
  }

  @FieldResolver(() => StringChoice, {
    nullable: true,
    description: 'Resolves the personality traits choice for the background.'
  })
  async personality_traits(@Root() background: Background): Promise<StringChoice | null> {
    return resolveStringChoice(background.personality_traits as Choice)
  }

  @FieldResolver(() => IdealChoice, {
    nullable: true,
    description: 'Resolves the ideals choice for the background.'
  })
  async ideals(@Root() background: Background): Promise<IdealChoice> {
    const choiceData = background.ideals as Choice

    const optionSet = choiceData.from as OptionsArrayOptionSet

    const resolvedIdealOptions: ResolvedIdealOption[] = []
    if (Array.isArray(optionSet.options)) {
      for (const option of optionSet.options) {
        const idealOption = option as IdealOption
        const resolvedAlignments = (await resolveMultipleReferences(
          idealOption.alignments,
          AlignmentModel
        )) as Alignment[]

        resolvedIdealOptions.push({
          option_type: idealOption.option_type,
          desc: idealOption.desc,
          alignments: resolvedAlignments
        })
      }
    }

    return {
      choose: choiceData.choose,
      type: choiceData.type,
      from: {
        option_set_type: optionSet.option_set_type,
        options: resolvedIdealOptions
      }
    }
  }

  @FieldResolver(() => LanguageChoice, {
    nullable: true,
    description: 'Resolves the language choices for the background.'
  })
  async language_options(@Root() background: Background): Promise<LanguageChoice | null> {
    return resolveLanguageChoice(background.language_options as Choice)
  }

  @FieldResolver(() => [StartingEquipmentChoice], {
    nullable: true,
    description: 'Resolves starting equipment choices for the background.'
  })
  async starting_equipment_options(
    @Root() background: Background
  ): Promise<StartingEquipmentChoice[] | null> {
    return resolveStartingEquipmentChoices(background.starting_equipment_options)
  }
}

@Resolver(EquipmentRef)
export class EquipmentRefResolver {
  @FieldResolver(() => Equipment)
  async equipment(@Root() equipmentRef: EquipmentRef): Promise<Equipment | null> {
    return resolveSingleReference(equipmentRef.equipment, EquipmentModel)
  }
}
