import { Resolver, Query, Arg, Args, ArgsType, Field, FieldResolver, Root, Int } from 'type-graphql'
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
import { buildMongoSortQuery } from '@/graphql/2014rewrite/common/inputs'

const SpellArgsSchema = z.object({
  name: z.string().optional(),
  level: z.array(z.number().int().min(0).max(9)).optional(),
  school: z.array(z.string()).optional(),
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
    description: 'Filter by spell level (e.g., [1, 3] for levels 1 to 3)'
  })
  level?: number[]

  @Field(() => [String], { nullable: true, description: 'Filter by magic school index' })
  school?: string[]

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

    if (filters.length > 0) {
      query.where({ $and: filters })
    }

    const sortQuery = buildMongoSortQuery({
      defaultSortField: 'name',
      orderDirection: validatedArgs.order_direction
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
