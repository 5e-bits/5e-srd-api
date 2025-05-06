// This file will export an array of all resolver classes
import { AbilityScoreResolver } from './abilityScoreResolver'
import { AlignmentResolver } from './alignmentResolver'
import { BackgroundResolver, EquipmentRefResolver } from './backgroundResolver'
import { ClassResolver, MultiClassingResolver, MultiClassingPrereqResolver } from './classResolver'
import { ConditionResolver } from './conditionResolver'
import { DamageTypeResolver } from './damageTypeResolver'
import { EquipmentCategoryResolver } from './equipmentCategoryResolver'
import { EquipmentResolver } from './equipmentResolver'
import { FeatResolver, PrerequisiteResolver } from './featResolver'
import { FeatureResolver, FeatureSpecificResolver } from './featureResolver'
import { LanguageResolver } from './languageResolver'
import { LevelResolver } from './levelResolver'
import { MagicItemResolver } from './magicItemResolver'
import { MagicSchoolResolver } from './magicSchoolResolver'
import { MonsterResolver } from './monsterResolver'
import { ProficiencyResolver } from './proficiencyResolver'
import { RaceResolver, RaceAbilityBonusResolver } from './raceResolver'
import { RuleResolver } from './ruleResolver'
import { RuleSectionResolver } from './ruleSectionResolver'
import { SkillResolver } from './skillResolver'
import { SpellResolver } from './spellResolver'
import { SubclassResolver, SubclassSpellResolver } from './subclassResolver'
import { SubraceResolver, SubraceAbilityBonusResolver } from './subraceResolver'
import { TraitResolver, TraitSpecificResolver, ActionDamageResolver } from './traitResolver'
import { WeaponPropertyResolver } from './weaponPropertyResolver'

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
  SubraceAbilityBonusResolver,
  // Class
  MultiClassingResolver,
  MultiClassingPrereqResolver,
  // Trait
  ActionDamageResolver,
  // Subclass
  SubclassSpellResolver
] as const

// Export a new mutable array combining the readonly ones
export const resolvers = [...collectionResolvers, ...fieldResolvers] as const
