import { FieldResolver, Resolver, Root } from 'type-graphql'

import { mapLevelObjectToArray } from '@/graphql/2014/utils/helpers'
import { createResolver } from '@/graphql/common/createResolver'
import { eqFilter, inFilter, numberFilter, regexFilter } from '@/graphql/common/filters'
import { LevelValue } from '@/graphql/common/types'
import { resolveMultipleReferences, resolveSingleReference } from '@/graphql/utils/resolvers'
import AbilityScoreModel, { AbilityScore } from '@/models/2014/abilityScore'
import ClassModel, { Class } from '@/models/2014/class'
import DamageTypeModel, { DamageType } from '@/models/2014/damageType'
import MagicSchoolModel, { MagicSchool } from '@/models/2014/magicSchool'
import SpellModel, { Spell, SpellDamage, SpellDC } from '@/models/2014/spell'
import SubclassModel, { Subclass } from '@/models/2014/subclass'

import { SpellArgs, SpellArgsSchema } from './args'

@Resolver(Spell)
export class SpellResolver extends createResolver({
  Type: Spell,
  Model: SpellModel,
  typeName: 'Spell',
  singular: 'spell',
  plural: 'spells',
  descriptions: {
    fields: 'Fields to sort Spells by',
    order: 'Specify sorting order for spells.',
    list: 'Gets all spells, optionally filtered and sorted.',
    single: 'Gets a single spell by its index.'
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
  @FieldResolver(() => DamageType, { nullable: true })
  async damage_type(@Root() spellDamage: SpellDamage): Promise<DamageType | null> {
    return resolveSingleReference(spellDamage.damage_type, DamageTypeModel)
  }

  @FieldResolver(() => [LevelValue])
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

@Resolver(SpellDC)
export class SpellDCResolver {
  @FieldResolver(() => AbilityScore, { nullable: true })
  async dc_type(@Root() spellDC: SpellDC): Promise<AbilityScore | null> {
    return resolveSingleReference(spellDC.dc_type, AbilityScoreModel)
  }
}
