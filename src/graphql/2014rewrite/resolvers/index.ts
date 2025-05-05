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
  TraitResolver
] as const

// For now, export an empty array until resolvers are created
// export const resolvers: Function[] = []; // Original empty array
