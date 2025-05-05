import { Resolver, Query, Arg, Args, ArgsType, Field, FieldResolver, Root } from 'type-graphql'
import ProficiencyModel, { Proficiency } from '@/models/2014/proficiency'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { IsOptional, IsString, IsEnum } from 'class-validator'
import { escapeRegExp } from '@/util'
import ClassModel, { Class } from '@/models/2014/class'
import RaceModel, { Race } from '@/models/2014/race'
import {
  resolveMultipleReferences,
  resolveSingleReference
} from '@/graphql/2014rewrite/utils/resolvers'
import { ProficiencyReference } from '../common/unions'
import EquipmentModel from '@/models/2014/equipment'
import EquipmentCategoryModel from '@/models/2014/equipmentCategory'
import AbilityScoreModel from '@/models/2014/abilityScore'
import SkillModel from '@/models/2014/skill'

// Define ArgsType for the proficiencies query
@ArgsType()
class ProficiencyArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by proficiency name (case-insensitive, partial match)'
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

@Resolver(Proficiency)
export class ProficiencyResolver {
  @Query(() => [Proficiency], {
    description: 'Query all Proficiencies, optionally filtered by name and sorted by name.'
  })
  async proficiencies(@Args() { name, order_direction }: ProficiencyArgs): Promise<Proficiency[]> {
    const query = ProficiencyModel.find()

    if (name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
    }

    if (order_direction) {
      query.sort({ name: order_direction === OrderByDirection.DESC ? -1 : 1 })
    }

    // Note: .lean() is used, so reference fields will contain raw data
    // FieldResolvers will be added in Pass 2.
    return query.lean()
  }

  @Query(() => Proficiency, {
    nullable: true,
    description: 'Gets a single proficiency by index.'
  })
  async proficiency(@Arg('index', () => String) index: string): Promise<Proficiency | null> {
    return ProficiencyModel.findOne({ index }).lean()
  }

  @FieldResolver(() => [Class], { nullable: true })
  async classes(@Root() proficiency: Proficiency): Promise<Class[]> {
    return resolveMultipleReferences(proficiency.classes, ClassModel)
  }

  @FieldResolver(() => [Race], { nullable: true })
  async races(@Root() proficiency: Proficiency): Promise<Race[]> {
    return resolveMultipleReferences(proficiency.races, RaceModel)
  }

  @FieldResolver(() => ProficiencyReference, { nullable: true })
  async reference(@Root() proficiency: Proficiency): Promise<typeof ProficiencyReference | null> {
    const ref = proficiency.reference
    if (!ref?.index || !ref.url) {
      return null
    }

    if (ref.url.includes('/equipment-categories/')) {
      return resolveSingleReference(ref, EquipmentCategoryModel)
    }
    if (ref.url.includes('/skills/')) {
      return resolveSingleReference(ref, SkillModel)
    }
    if (ref.url.includes('/ability-scores/')) {
      return resolveSingleReference(ref, AbilityScoreModel)
    }
    if (ref.url.includes('/equipment/')) {
      return resolveSingleReference(ref, EquipmentModel)
    }

    console.warn(
      `Unable to determine reference type from URL: ${ref.url} (Proficiency index: ${proficiency.index})`
    )
    return null
  }
}
