import { Resolver, Query, Arg, Args, ArgsType, Field, FieldResolver, Root, Int } from 'type-graphql'
import { z } from 'zod'
import BackgroundModel, { Background, EquipmentRef } from '@/models/2014/background'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
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
import { buildMongoSortQuery } from '../common/inputs'

// Zod schema for BackgroundArgs
const BackgroundArgsSchema = z.object({
  name: z.string().optional(),
  order_direction: z.nativeEnum(OrderByDirection).optional().default(OrderByDirection.ASC),
  skip: z.number().int().min(0).optional(), // TODO: Pass 5 - Implement pagination
  limit: z.number().int().min(1).optional() // TODO: Pass 5 - Implement pagination
})

// Zod schema for Background index argument
const BackgroundIndexArgsSchema = z.object({
  index: z.string().min(1, { message: 'Index must be a non-empty string' })
})

@ArgsType()
class BackgroundArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by background name (case-insensitive, partial match)'
  })
  name?: string

  @Field(() => OrderByDirection, {
    nullable: true,
    description: 'Sort direction (default: ASC for name)'
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

@Resolver(Background)
export class BackgroundResolver {
  @Query(() => [Background], {
    description: 'Gets all backgrounds, optionally filtered by name and sorted by name.'
  })
  async backgrounds(@Args() args: BackgroundArgs): Promise<Background[]> {
    const validatedArgs = BackgroundArgsSchema.parse(args)

    const query = BackgroundModel.find()

    if (validatedArgs.name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    const sortQuery = buildMongoSortQuery({
      defaultSortField: 'name',
      orderDirection: validatedArgs.order_direction
    })
    if (sortQuery) {
      query.sort(sortQuery)
    }

    // TODO: Pass 5 - Implement pagination
    // if (skip !== undefined) {
    //   query.skip(skip);
    // }
    // if (limit !== undefined) {
    //  query.limit(limit);
    // }

    return query.lean()
  }

  @Query(() => Background, { nullable: true, description: 'Gets a single background by index.' })
  async background(@Arg('index', () => String) indexInput: string): Promise<Background | null> {
    const { index } = BackgroundIndexArgsSchema.parse({ index: indexInput })
    return BackgroundModel.findOne({ index }).lean()
  }

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
    // TODO: Pass 5 - See if any choice resolvers can be refactored
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
