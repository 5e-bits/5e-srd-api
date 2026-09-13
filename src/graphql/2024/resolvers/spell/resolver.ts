import { Args, FieldResolver, Query, Resolver, Root } from 'type-graphql'

import { mapLevelObjectToArray } from '@/graphql/2014/utils/helpers'
import { buildSortPipeline } from '@/graphql/common/args'
import { buildMongoQueryFromNumberFilter } from '@/graphql/common/inputs'
import { LevelValue } from '@/graphql/common/types'
import { resolveMultipleReferences, resolveSingleReference } from '@/graphql/utils/resolvers'
import AbilityScoreModel, { AbilityScore2024 } from '@/models/2024/abilityScore'
import ClassModel, { Class2024 } from '@/models/2024/class'
import DamageTypeModel, { DamageType2024 } from '@/models/2024/damageType'
import MagicSchoolModel, { MagicSchool2024 } from '@/models/2024/magicSchool'
import Spell2024Model, { Spell2024, SpellDamage2024, SpellDC2024 } from '@/models/2024/spell'
import SubclassModel, { Subclass2024 } from '@/models/2024/subclass'
import { escapeRegExp } from '@/util'

import {
  SPELL_SORT_FIELD_MAP,
  SpellArgs,
  SpellArgsSchema,
  SpellIndexArgs,
  SpellIndexArgsSchema,
  SpellOrderField
} from './args'

@Resolver(Spell2024)
export class SpellResolver {
  @Query(() => [Spell2024], {
    description: 'Gets all 2024 spells, optionally filtered and sorted.'
  })
  async spells(@Args(() => SpellArgs) args: SpellArgs): Promise<Spell2024[]> {
    const validatedArgs = SpellArgsSchema.parse(args)

    const query = Spell2024Model.find()
    const filters: any[] = []

    if (validatedArgs.name != null && validatedArgs.name !== '') {
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

    const sortQuery = buildSortPipeline<SpellOrderField>({
      order: validatedArgs.order,
      sortFieldMap: SPELL_SORT_FIELD_MAP,
      defaultSortField: SpellOrderField.NAME
    })
    if (Object.keys(sortQuery).length > 0) {
      query.sort(sortQuery)
    }

    if (validatedArgs.skip !== undefined) {
      query.skip(validatedArgs.skip)
    }
    if (validatedArgs.limit !== undefined) {
      query.limit(validatedArgs.limit)
    }

    return query.lean()
  }

  @Query(() => Spell2024, { nullable: true, description: 'Gets a single 2024 spell by its index.' })
  async spell(@Args(() => SpellIndexArgs) args: SpellIndexArgs): Promise<Spell2024 | null> {
    const { index } = SpellIndexArgsSchema.parse(args)
    return Spell2024Model.findOne({ index }).lean()
  }

  @FieldResolver(() => [Class2024], { nullable: true })
  async classes(@Root() spell: Spell2024): Promise<Class2024[]> {
    return resolveMultipleReferences(spell.classes, ClassModel)
  }

  @FieldResolver(() => MagicSchool2024, { nullable: true })
  async school(@Root() spell: Spell2024): Promise<MagicSchool2024 | null> {
    return resolveSingleReference(spell.school, MagicSchoolModel)
  }

  @FieldResolver(() => [Subclass2024], { nullable: true })
  async subclasses(@Root() spell: Spell2024): Promise<Subclass2024[]> {
    return resolveMultipleReferences(spell.subclasses, SubclassModel)
  }

  @FieldResolver(() => [LevelValue], {
    nullable: true,
    description: 'Healing amount based on spell slot level, transformed from raw data.'
  })
  async heal_at_slot_level(@Root() spell: Spell2024): Promise<LevelValue[] | null> {
    return mapLevelObjectToArray(spell.heal_at_slot_level)
  }
}

@Resolver(SpellDamage2024)
export class SpellDamageResolver {
  @FieldResolver(() => DamageType2024, { nullable: true })
  async damage_type(@Root() spellDamage: SpellDamage2024): Promise<DamageType2024 | null> {
    return resolveSingleReference(spellDamage.damage_type, DamageTypeModel)
  }

  @FieldResolver(() => [LevelValue])
  async damage_at_slot_level(@Root() spellDamage: SpellDamage2024): Promise<LevelValue[] | null> {
    return mapLevelObjectToArray(spellDamage.damage_at_slot_level)
  }

  @FieldResolver(() => [LevelValue], {
    nullable: true,
    description: 'Damage scaling based on character level, transformed from raw data.'
  })
  async damage_at_character_level(
    @Root() spellDamage: SpellDamage2024
  ): Promise<LevelValue[] | null> {
    return mapLevelObjectToArray(spellDamage.damage_at_character_level)
  }
}

@Resolver(SpellDC2024)
export class SpellDCResolver {
  @FieldResolver(() => AbilityScore2024, { nullable: true })
  async dc_type(@Root() spellDC: SpellDC2024): Promise<AbilityScore2024 | null> {
    return resolveSingleReference(spellDC.dc_type, AbilityScoreModel)
  }
}
