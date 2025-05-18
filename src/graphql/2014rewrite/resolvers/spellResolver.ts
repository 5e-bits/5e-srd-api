import {
  Resolver,
  Query,
  Arg,
  Args,
  ArgsType,
  Field,
  FieldResolver,
  Root,
  Int,
  InputType,
  registerEnumType
} from 'type-graphql'
import { z } from 'zod'
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
import {
  buildMongoSortQuery,
  NumberFilterInput,
  NumberFilterInputSchema,
  buildMongoQueryFromNumberFilter
} from '@/graphql/2014rewrite/common/inputs'

const AreaOfEffectFilterInputSchema = z.object({
  type: z.array(z.string()).optional(),
  size: NumberFilterInputSchema.optional()
})

@InputType({
  description: 'Input for filtering by area of effect properties.'
})
class AreaOfEffectFilterInput {
  @Field(() => [String], {
    nullable: true,
    description: 'Filter by area of effect type (e.g., ["sphere", "cone"])'
  })
  type?: string[]

  @Field(() => NumberFilterInput, {
    nullable: true,
    description: 'Filter by area of effect size (in feet).'
  })
  size?: NumberFilterInput
}

// Enum for Spell sortable fields
export enum SpellOrderField {
  NAME = 'name',
  LEVEL = 'level',
  SCHOOL = 'school',
  AREA_OF_EFFECT_SIZE = 'area_of_effect_size' // Matches old API
}

registerEnumType(SpellOrderField, {
  name: 'SpellOrderField',
  description: 'Fields to sort Spells by'
})

// Map GraphQL SpellOrderField to MongoDB field name
const SPELL_SORT_FIELD_MAP: Record<SpellOrderField, string> = {
  [SpellOrderField.NAME]: 'name',
  [SpellOrderField.LEVEL]: 'level',
  [SpellOrderField.SCHOOL]: 'school.name',
  [SpellOrderField.AREA_OF_EFFECT_SIZE]: 'area_of_effect.size'
}

const SpellArgsSchema = z.object({
  name: z.string().optional(),
  level: z.array(z.number().int().min(0).max(9)).optional(),
  school: z.array(z.string()).optional(),
  class: z.array(z.string()).optional(),
  subclass: z.array(z.string()).optional(),
  concentration: z.boolean().optional(),
  ritual: z.boolean().optional(),
  attack_type: z.array(z.string()).optional(),
  casting_time: z.array(z.string()).optional(),
  area_of_effect: AreaOfEffectFilterInputSchema.optional(),
  damage_type: z.array(z.string()).optional(),
  dc_type: z.array(z.string()).optional(),
  range: z.array(z.string()).optional(),
  order_by: z.nativeEnum(SpellOrderField).optional().default(SpellOrderField.NAME),
  order_direction: z.nativeEnum(OrderByDirection).optional().default(OrderByDirection.ASC),
  skip: z.number().int().min(0).optional(),
  limit: z.number().int().min(1).optional()
})

const SpellIndexArgsSchema = z.object({
  index: z.string().min(1, { message: 'Index must be a non-empty string' })
})

@ArgsType()
class SpellArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by spell name (case-insensitive, partial match)'
  })
  name?: string

  @Field(() => [Int], {
    nullable: true,
    description: 'Filter by spell level (e.g., [0, 9])'
  })
  level?: number[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by magic school index (e.g., ["evocation"])'
  })
  school?: string[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by class index that can cast the spell (e.g., ["wizard"])'
  })
  class?: string[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by subclass index that can cast the spell (e.g., ["lore"])'
  })
  subclass?: string[]

  @Field(() => Boolean, { nullable: true, description: 'Filter by concentration requirement' })
  concentration?: boolean

  @Field(() => Boolean, { nullable: true, description: 'Filter by ritual requirement' })
  ritual?: boolean

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by attack type (e.g., ["ranged", "melee"])'
  })
  attack_type?: string[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by casting time (e.g., ["1 action"])'
  })
  casting_time?: string[]

  @Field(() => AreaOfEffectFilterInput, {
    nullable: true,
    description: 'Filter by area of effect properties'
  })
  area_of_effect?: AreaOfEffectFilterInput

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by damage type index (e.g., ["fire"])'
  })
  damage_type?: string[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by saving throw DC type index (e.g., ["dex"])'
  })
  dc_type?: string[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by spell range (e.g., ["Self", "Touch"])'
  })
  range?: string[]

  @Field(() => SpellOrderField, {
    nullable: true,
    description: 'Field to sort spells by (default: name)'
  })
  order_by?: SpellOrderField

  @Field(() => OrderByDirection, {
    nullable: true,
    // defaultValue: OrderByDirection.ASC, // Default is handled by Zod
    description: 'Sort direction for the name field (default: ASC)'
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

@Resolver(Spell)
export class SpellResolver {
  @Query(() => [Spell], { description: 'Gets all spells, optionally filtered and sorted.' })
  async spells(@Args() args: SpellArgs): Promise<Spell[]> {
    const validatedArgs = SpellArgsSchema.parse(args)

    const query = SpellModel.find()
    const filters: any[] = []

    if (validatedArgs.name) {
      filters.push({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }
    if (validatedArgs.level && validatedArgs.level.length > 0) {
      filters.push({ level: { $in: validatedArgs.level } })
    }
    if (validatedArgs.school && validatedArgs.school.length > 0) {
      filters.push({ 'school.index': { $in: validatedArgs.school } })
    }
    if (validatedArgs.class && validatedArgs.class.length > 0) {
      filters.push({ 'classes.index': { $in: validatedArgs.class } })
    }
    if (validatedArgs.subclass && validatedArgs.subclass.length > 0) {
      filters.push({ 'subclasses.index': { $in: validatedArgs.subclass } })
    }
    if (typeof validatedArgs.concentration === 'boolean') {
      filters.push({ concentration: validatedArgs.concentration })
    }
    if (typeof validatedArgs.ritual === 'boolean') {
      filters.push({ ritual: validatedArgs.ritual })
    }
    if (validatedArgs.attack_type && validatedArgs.attack_type.length > 0) {
      filters.push({ attack_type: { $in: validatedArgs.attack_type } })
    }
    if (validatedArgs.casting_time && validatedArgs.casting_time.length > 0) {
      filters.push({ casting_time: { $in: validatedArgs.casting_time } })
    }
    if (validatedArgs.area_of_effect) {
      if (validatedArgs.area_of_effect.type && validatedArgs.area_of_effect.type.length > 0) {
        filters.push({ 'area_of_effect.type': { $in: validatedArgs.area_of_effect.type } })
      }
      if (validatedArgs.area_of_effect.size) {
        const sizeFilter = buildMongoQueryFromNumberFilter(validatedArgs.area_of_effect.size)
        if (sizeFilter) {
          filters.push({ 'area_of_effect.size': sizeFilter })
        }
      }
    }
    if (validatedArgs.damage_type && validatedArgs.damage_type.length > 0) {
      filters.push({ 'damage.damage_type.index': { $in: validatedArgs.damage_type } })
    }
    if (validatedArgs.dc_type && validatedArgs.dc_type.length > 0) {
      filters.push({ 'dc.dc_type.index': { $in: validatedArgs.dc_type } })
    }
    if (validatedArgs.range && validatedArgs.range.length > 0) {
      filters.push({ range: { $in: validatedArgs.range } })
    }

    if (filters.length > 0) {
      query.where({ $and: filters })
    }

    const sortQuery = buildMongoSortQuery<SpellOrderField>({
      orderBy: validatedArgs.order_by,
      orderDirection: validatedArgs.order_direction,
      sortFieldMap: SPELL_SORT_FIELD_MAP,
      defaultSortField: SpellOrderField.NAME
    })
    if (sortQuery) {
      query.sort(sortQuery)
    }

    // TODO: Pass 5 - Implement pagination
    // if (skip) {
    //   query.skip(skip)
    // }
    // if (limit) {
    //   query.limit(limit)
    // }

    return query.lean()
  }

  @Query(() => Spell, { nullable: true, description: 'Gets a single spell by its index.' })
  async spell(@Arg('index') indexInput: string): Promise<Spell | null> {
    const { index } = SpellIndexArgsSchema.parse({ index: indexInput })
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
