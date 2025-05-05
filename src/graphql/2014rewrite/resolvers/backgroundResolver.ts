import { Resolver, Query, Arg, Args, ArgsType, Field, FieldResolver, Root } from 'type-graphql'
import { Background, EquipmentRef } from '@/models/2014/background' // Import EquipmentRef as well
import BackgroundModel from '@/models/2014/background' // Import the default export for data access
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums' // Import shared enum
import { IsOptional, IsString, IsEnum } from 'class-validator'
import { escapeRegExp } from '@/util'

// Import types and models needed for FieldResolvers
import { Proficiency } from '@/models/2014/proficiency'
import ProficiencyModel from '@/models/2014/proficiency'
import { Equipment } from '@/models/2014/equipment'
import EquipmentModel from '@/models/2014/equipment'
import {
  resolveMultipleReferences,
  resolveSingleReference
} from '@/graphql/2014rewrite/utils/resolvers'

// Define ArgsType for the backgrounds query
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
