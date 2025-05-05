import { Resolver, Query, Arg, Args, ArgsType, Field, FieldResolver, Root } from 'type-graphql'
import { Trait, TraitSpecific } from '@/models/2014/trait'
import TraitModel from '@/models/2014/trait'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { IsOptional, IsString, IsEnum } from 'class-validator'
import { escapeRegExp } from '@/util'
// Import types/models for FieldResolvers
import { Race } from '@/models/2014/race'
import RaceModel from '@/models/2014/race'
import { Subrace } from '@/models/2014/subrace'
import SubraceModel from '@/models/2014/subrace'
import { Proficiency } from '@/models/2014/proficiency'
import ProficiencyModel from '@/models/2014/proficiency'
import { DamageType } from '@/models/2014/damageType'
import DamageTypeModel from '@/models/2014/damageType'
import {
  resolveMultipleReferences,
  resolveSingleReference
} from '@/graphql/2014rewrite/utils/resolvers'

// Define ArgsType for the traits query
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
}

// Separate resolver for nested TraitSpecific type
@Resolver(TraitSpecific)
export class TraitSpecificResolver {
  @FieldResolver(() => DamageType, { nullable: true })
  async damage_type(@Root() traitSpecific: TraitSpecific): Promise<DamageType | null> {
    return resolveSingleReference(traitSpecific.damage_type, DamageTypeModel)
  }

  // Resolvers for choices (subtrait_options, spell_options) will go here in Pass 3
}
