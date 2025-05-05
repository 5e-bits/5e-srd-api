// This file will export an array of all resolver classes
import { AlignmentResolver } from './alignmentResolver'
import { ConditionResolver } from './conditionResolver'
import { DamageTypeResolver } from './damageTypeResolver'
import { LanguageResolver } from './languageResolver'
import { MagicSchoolResolver } from './magicSchoolResolver'
import { RuleSectionResolver } from './ruleSectionResolver'
import { WeaponPropertyResolver } from './weaponPropertyResolver'
import { EquipmentCategoryResolver } from './equipmentCategoryResolver'
import { AbilityScoreResolver } from './abilityScoreResolver'
import { SkillResolver } from './skillResolver'
import { BackgroundResolver, EquipmentRefResolver } from './backgroundResolver'
import { FeatResolver, PrerequisiteResolver } from './featResolver'
import { RuleResolver } from './ruleResolver'
import { TraitResolver, TraitSpecificResolver } from './traitResolver'
import { MagicItemResolver } from './magicItemResolver'
import { SubraceResolver, SubraceAbilityBonusResolver } from './subraceResolver'
import { EquipmentResolver } from './equipmentResolver'
import { ProficiencyResolver } from './proficiencyResolver'
import { FeatureResolver, FeatureSpecificResolver } from './featureResolver'
import { RaceResolver, RaceAbilityBonusResolver } from './raceResolver'
import { SpellResolver } from './spellResolver'
import { LevelResolver } from './levelResolver'
import { SubclassResolver } from './subclassResolver'
import { ClassResolver } from './classResolver'
import { MonsterResolver } from './monsterResolver'

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
  // Feature
  FeatureSpecificResolver,
  // Race
  RaceAbilityBonusResolver,
  // Subrace
  SubraceAbilityBonusResolver
] as const

// Export a new mutable array combining the readonly ones
export const resolvers = [...collectionResolvers, ...fieldResolvers] as const
