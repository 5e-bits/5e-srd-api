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
import { BackgroundResolver } from './backgroundResolver'
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

export const resolvers = [
  AlignmentResolver,
  ConditionResolver,
  DamageTypeResolver,
  LanguageResolver,
  MagicSchoolResolver,
  RuleSectionResolver,
  WeaponPropertyResolver,
  EquipmentCategoryResolver,
  AbilityScoreResolver,
  SkillResolver,
  BackgroundResolver,
  FeatResolver,
  RuleResolver,
  TraitResolver,
  MagicItemResolver,
  SubraceResolver,
  EquipmentResolver,
  ProficiencyResolver,
  FeatureResolver,
  RaceResolver,
  SpellResolver,
  LevelResolver,
  SubclassResolver,
  ClassResolver,
  MonsterResolver
] as const

// For now, export an empty array until resolvers are created
// export const resolvers: Function[] = []; // Original empty array
