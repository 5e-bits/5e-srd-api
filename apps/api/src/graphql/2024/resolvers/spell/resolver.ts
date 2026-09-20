import { FieldResolver, Resolver, Root } from 'type-graphql'

import { mapLevelObjectToArray } from '@/graphql/2014/utils/helpers'
import { createResolver } from '@/graphql/common/createResolver'
import { eqFilter, inFilter, numberFilter, regexFilter } from '@/graphql/common/filters'
import { LevelValue } from '@/graphql/common/types'
import { resolveMultipleReferences, resolveSingleReference } from '@/graphql/utils/resolvers'
import AbilityScoreModel, { AbilityScore2024 } from '@/models/2024/abilityScore'
import ClassModel, { Class2024 } from '@/models/2024/class'
import DamageTypeModel, { DamageType2024 } from '@/models/2024/damageType'
import MagicSchoolModel, { MagicSchool2024 } from '@/models/2024/magicSchool'
import Spell2024Model, { Spell2024, SpellDamage2024, SpellDC2024 } from '@/models/2024/spell'
import SubclassModel, { Subclass2024 } from '@/models/2024/subclass'

import { SpellArgs, SpellArgsSchema } from './args'

@Resolver(Spell2024)
export class SpellResolver extends createResolver({
  Type: Spell2024,
  Model: Spell2024Model,
  typeName: 'Spell',
  enumTypeName: 'Spell2024',
  singular: 'spell',
  plural: 'spells',
  descriptions: {
    fields: 'Fields to sort 2024 Spells by',
    order: 'Specify sorting order for spells.',
    list: 'Gets all 2024 spells, optionally filtered and sorted.',
    single: 'Gets a single 2024 spell by its index.'
  },
  orderFields: {
    NAME: { value: 'name', path: 'name' },
    LEVEL: { value: 'level', path: 'level' },
    SCHOOL: { value: 'school', path: 'school.name' },
    AREA_OF_EFFECT_SIZE: { value: 'area_of_effect_size', path: 'area_of_effect.size' }
  },
  defaultSort: 'NAME',
  Args: SpellArgs,
  argsSchema: SpellArgsSchema,
  filters: (a) => [
    regexFilter('name', a.name),
    inFilter('level', a.level),
    inFilter('school.index', a.school),
    inFilter('classes.index', a.class),
    inFilter('subclasses.index', a.subclass),
    eqFilter('concentration', a.concentration),
    eqFilter('ritual', a.ritual),
    inFilter('attack_type', a.attack_type),
    inFilter('casting_time', a.casting_time),
    inFilter('area_of_effect.type', a.area_of_effect?.type),
    numberFilter('area_of_effect.size', a.area_of_effect?.size),
    inFilter('damage.damage_type.index', a.damage_type),
    inFilter('dc.dc_type.index', a.dc_type),
    inFilter('range', a.range)
  ]
}) {
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
