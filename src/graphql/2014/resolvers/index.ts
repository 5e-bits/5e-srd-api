// This file will export an array of all resolver classes
import { AbilityScoreResolver } from './abilityScore/resolver'
import { AlignmentResolver } from './alignment/resolver'
import { BackgroundResolver, EquipmentRefResolver } from './background/resolver'
import {
  ClassEquipmentResolver,
  ClassResolver,
  MultiClassingPrereqResolver,
  MultiClassingResolver
} from './class/resolver'
import { ConditionResolver } from './condition/resolver'
import { DamageTypeResolver } from './damageType/resolver'
import { ContentFieldResolver, EquipmentResolver } from './equipment/resolver'
import { EquipmentCategoryResolver } from './equipmentCategory/resolver'
import { FeatResolver, PrerequisiteResolver } from './feat/resolver'
import { FeatureResolver, FeatureSpecificResolver } from './feature/resolver'
import { LanguageResolver } from './language/resolver'
import { LevelResolver } from './level/resolver'
import { MagicItemResolver } from './magicItem/resolver'
import { MagicSchoolResolver } from './magicSchool/resolver'
import {
  ArmorClassArmorResolver,
  ArmorClassConditionResolver,
  ArmorClassSpellResolver,
  DifficultyClassResolver,
  MonsterActionResolver,
  MonsterProficiencyResolver,
  MonsterResolver,
  SpecialAbilitySpellcastingResolver,
  SpecialAbilitySpellResolver
} from './monster/resolver'
import { ProficiencyResolver } from './proficiency/resolver'
import { RaceAbilityBonusResolver, RaceResolver } from './race/resolver'
import { RuleResolver } from './rule/resolver'
import { RuleSectionResolver } from './ruleSection/resolver'
import { SkillResolver } from './skill/resolver'
import { SpellDamageResolver, SpellResolver, SpellDCResolver } from './spell/resolver'
import { SubclassResolver, SubclassSpellResolver } from './subclass/resolver'
import { SubraceAbilityBonusResolver, SubraceResolver } from './subrace/resolver'
import { ActionDamageResolver, TraitResolver, TraitSpecificResolver } from './trait/resolver'
import { WeaponPropertyResolver } from './weaponProperty/resolver'

const collectionResolvers = [
  AbilityScoreResolver,
  AlignmentResolver,
  BackgroundResolver,
  ClassResolver,
  ConditionResolver,
  DamageTypeResolver,
  EquipmentCategoryResolver,
  EquipmentResolver,
  FeatResolver,
  FeatureResolver,
  LanguageResolver,
  LevelResolver,
  MagicItemResolver,
  MagicSchoolResolver,
  MonsterResolver,
  ProficiencyResolver,
  RaceResolver,
  RuleResolver,
  RuleSectionResolver,
  SkillResolver,
  SpellResolver,
  SubclassResolver,
  SubraceResolver,
  TraitResolver,
  WeaponPropertyResolver
] as const

const fieldResolvers = [
  // Background
  EquipmentRefResolver,
  // Feat
  PrerequisiteResolver,
  // Trait
  TraitSpecificResolver,
  ActionDamageResolver,
  // Feature
  FeatureSpecificResolver,
  // Race
  RaceAbilityBonusResolver,
  // Subrace
  SubraceAbilityBonusResolver,
  // Class
  MultiClassingResolver,
  MultiClassingPrereqResolver,
  ClassEquipmentResolver,
  // Subclass
  SubclassSpellResolver,
  // Spell
  SpellDamageResolver,
  SpellDCResolver,
  // Equipment
  ContentFieldResolver,
  // Monster Field Resolvers
  ArmorClassArmorResolver,
  ArmorClassSpellResolver,
  ArmorClassConditionResolver,
  MonsterProficiencyResolver,
  SpecialAbilitySpellcastingResolver,
  SpecialAbilitySpellResolver,
  MonsterActionResolver,
  DifficultyClassResolver
] as const

// Export a new mutable array combining the readonly ones
export const resolvers = [...collectionResolvers, ...fieldResolvers] as const
