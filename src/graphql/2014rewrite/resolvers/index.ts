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
import { FeatResolver } from './featResolver'
import { RuleResolver } from './ruleResolver'
import { TraitResolver } from './traitResolver'
import { MagicItemResolver } from './magicItemResolver'
import { SubraceResolver } from './subraceResolver'
import { EquipmentResolver } from './equipmentResolver'
import { ProficiencyResolver } from './proficiencyResolver'
import { FeatureResolver } from './featureResolver'
import { RaceResolver } from './raceResolver'
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
]

const fieldResolvers = [
  // Background
  EquipmentRefResolver
]

export const resolvers = [...collectionResolvers, ...fieldResolvers] as const

// For now, export an empty array until resolvers are created
// export const resolvers: Function[] = []; // Original empty array
