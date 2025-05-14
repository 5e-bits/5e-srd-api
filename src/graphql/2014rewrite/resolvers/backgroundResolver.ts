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
  resolveStringChoice
} from '@/graphql/2014rewrite/utils/resolvers'
import { StringChoice } from '../common/types'
import { IdealChoice, IdealOption, IdealOptionSet } from '../types/backgroundTypes'
import { Choice, OptionsArrayOptionSet, IdealOption as DbIdealOption } from '@/models/2014/common'

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

    const dbOptionSet = choiceData.from as OptionsArrayOptionSet

    const gqlIdealOptions: IdealOption[] = []
    if (dbOptionSet.options && Array.isArray(dbOptionSet.options)) {
      for (const dbOption of dbOptionSet.options) {
        // Assuming these options are specifically DbIdealOption based on the 'ideals' context
        const dbIdealOpt = dbOption as DbIdealOption
        const resolvedAlignments = (await resolveMultipleReferences(
          dbIdealOpt.alignments,
          AlignmentModel
        )) as Alignment[]

        gqlIdealOptions.push({
          option_type: dbIdealOpt.option_type,
          desc: dbIdealOpt.desc,
          alignments: resolvedAlignments
        })
      }
    }

    const gqlOptionSet: IdealOptionSet = {
      option_set_type: dbOptionSet.option_set_type,
      options: gqlIdealOptions
    }

    return {
      choose: choiceData.choose,
      type: choiceData.type,
      from: gqlOptionSet
    }
  }

  // Field Resolvers for choices (language_options, etc.) will be added in Pass 3
}

// Separate Resolver for the nested EquipmentRef type
@Resolver(EquipmentRef)
export class EquipmentRefResolver {
  @FieldResolver(() => Equipment)
  async equipment(@Root() equipmentRef: EquipmentRef): Promise<Equipment | null> {
    return resolveSingleReference(equipmentRef.equipment, EquipmentModel)
  }
}
