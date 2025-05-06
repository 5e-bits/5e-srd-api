import { Resolver, Query, Arg, Args, ArgsType, Field, FieldResolver, Root, Int } from 'type-graphql'
import { IsOptional, IsString, IsEnum, IsInt, Min, Max } from 'class-validator'
import SpellModel, { Spell, SpellDamage } from '@/models/2014/spell'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { escapeRegExp } from '@/util'
import ClassModel, { Class } from '@/models/2014/class'
import MagicSchoolModel, { MagicSchool } from '@/models/2014/magicSchool'
import SubclassModel, { Subclass } from '@/models/2014/subclass'
import {
  resolveMultipleReferences,
  resolveSingleReference
} from '@/graphql/2014rewrite/utils/resolvers'
import { LevelValue } from '@/graphql/2014rewrite/common/types'
import { mapLevelObjectToArray } from '@/graphql/2014rewrite/utils/helpers'

@ArgsType()
class SpellArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by spell name (case-insensitive, partial match)'
  })
  @IsOptional()
  @IsString()
  name?: string

  @Field(() => [Int], {
    nullable: true,
    description: 'Filter by spell level (e.g., [1, 3] for levels 1 to 3)'
  })
  @IsOptional()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(9, { each: true })
  level?: number[]

  @Field(() => [String], { nullable: true, description: 'Filter by magic school index' })
  @IsOptional()
  @IsString({ each: true })
  school?: string[]

  @Field(() => OrderByDirection, {
    nullable: true,
    defaultValue: OrderByDirection.ASC,
    description: 'Sort direction for the name field (default: ASC)'
  })
  @IsOptional()
  @IsEnum(OrderByDirection)
  order_direction?: OrderByDirection
}

@Resolver(Spell)
export class SpellResolver {
  @Query(() => [Spell], { description: 'Gets all spells, optionally filtered and sorted.' })
  async spells(@Args() { name, level, school, order_direction }: SpellArgs): Promise<Spell[]> {
    const query = SpellModel.find()
    const filters: any = {}

    if (name) {
      filters.name = { $regex: new RegExp(escapeRegExp(name), 'i') }
    }
    if (level && level.length > 0) {
      filters.level = { $in: level }
    }
    if (school && school.length > 0) {
      filters['school.index'] = { $in: school }
    }

    if (Object.keys(filters).length > 0) {
      query.where(filters)
    }

    if (order_direction) {
      const sortOrder = order_direction === OrderByDirection.DESC ? -1 : 1
      query.sort({ name: sortOrder })
    }

    return query.lean()
  }

  @Query(() => Spell, { nullable: true, description: 'Gets a single spell by its index.' })
  async spell(@Arg('index', () => String) index: string): Promise<Spell | null> {
    return SpellModel.findOne({ index }).lean()
  }

  @FieldResolver(() => [Class], { nullable: true })
  async classes(@Root() spell: Spell): Promise<Class[]> {
    return resolveMultipleReferences(spell.classes, ClassModel)
  }

  @FieldResolver(() => MagicSchool, { nullable: true })
  async school(@Root() spell: Spell): Promise<MagicSchool | null> {
    return resolveSingleReference(spell.school, MagicSchoolModel)
  }

  @FieldResolver(() => [Subclass], { nullable: true })
  async subclasses(@Root() spell: Spell): Promise<Subclass[]> {
    return resolveMultipleReferences(spell.subclasses, SubclassModel)
  }

  @FieldResolver(() => [LevelValue], {
    nullable: true,
    description: 'Healing amount based on spell slot level, transformed from raw data.'
  })
  async heal_at_slot_level(@Root() spell: Spell): Promise<LevelValue[] | null> {
    return mapLevelObjectToArray(spell.heal_at_slot_level)
  }
}

@Resolver(SpellDamage)
export class SpellDamageResolver {
  @FieldResolver(() => [LevelValue], {
    nullable: true,
    description: 'Damage scaling based on spell slot level, transformed from raw data.'
  })
  async damage_at_slot_level(@Root() spellDamage: SpellDamage): Promise<LevelValue[] | null> {
    return mapLevelObjectToArray(spellDamage.damage_at_slot_level)
  }

  @FieldResolver(() => [LevelValue], {
    nullable: true,
    description: 'Damage scaling based on character level, transformed from raw data.'
  })
  async damage_at_character_level(@Root() spellDamage: SpellDamage): Promise<LevelValue[] | null> {
    return mapLevelObjectToArray(spellDamage.damage_at_character_level)
  }
}
