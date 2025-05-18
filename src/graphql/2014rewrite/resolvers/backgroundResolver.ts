import { Resolver, Query, Arg, Args, ArgsType, Field, FieldResolver, Root } from 'type-graphql'
import BackgroundModel, { Background, EquipmentRef } from '@/models/2014/background'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { IsOptional, IsString, IsEnum } from 'class-validator'
import { escapeRegExp } from '@/util'

import ProficiencyModel, { Proficiency } from '@/models/2014/proficiency'
import EquipmentModel, { Equipment } from '@/models/2014/equipment'
import AlignmentModel, { Alignment } from '@/models/2014/alignment'
import {
  resolveMultipleReferences,
  resolveSingleReference,
  resolveStringChoice,
  resolveLanguageChoice
} from '@/graphql/2014rewrite/utils/resolvers'
import { StringChoice, LanguageChoice } from '@/graphql/2014rewrite/common/choiceTypes'
import { IdealChoice, IdealOption as ResolvedIdealOption } from '../types/backgroundTypes'
import { Choice, IdealOption, OptionsArrayOptionSet } from '@/models/2014/common'
import { StartingEquipmentChoice } from '../types/startingEquipment'
import { resolveStartingEquipmentChoices } from '../utils/startingEquipmentResolver'

@ArgsType()
class BackgroundArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by background name (case-insensitive, partial match)'
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

@Resolver(Background)
export class BackgroundResolver {
  @Query(() => [Background], {
    description: 'Gets all backgrounds, optionally filtered by name and sorted by name.'
  })
  async backgrounds(@Args() { name, order_direction }: BackgroundArgs): Promise<Background[]> {
    const query = BackgroundModel.find()

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

  @Query(() => Background, { nullable: true, description: 'Gets a single background by index.' })
  async background(@Arg('index', () => String) index: string): Promise<Background | null> {
    // Note: .lean() is used, reference/choice fields will contain raw data.
    // FieldResolvers needed in Pass 3.
    return BackgroundModel.findOne({ index }).lean()
  }

  // Field Resolver for starting_proficiencies
  @FieldResolver(() => [Proficiency])
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
