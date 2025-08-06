import { DifficultyClassResolver } from '../common/resolver'
import { AbilityScoreResolver } from './abilityScore/resolver'
import { AlignmentResolver } from './alignment/resolver'
import { ConditionResolver } from './condition/resolver'
import { DamageTypeResolver } from './damageType/resolver'
import { ContentFieldResolver, EquipmentResolver, ToolResolver } from './equipment/resolver'
import { EquipmentCategoryResolver } from './equipmentCategory/resolver'
import { LanguageResolver } from './language/resolver'
import { MagicSchoolResolver } from './magicSchool/resolver'
import { SkillResolver } from './skill/resolver'
import { WeaponMasteryPropertyResolver } from './weaponMasteryProperty/resolver'
import { WeaponPropertyResolver } from './weaponProperty/resolver'

const collectionResolvers = [
  AbilityScoreResolver,
  AlignmentResolver,
  ConditionResolver,
  DamageTypeResolver,
  EquipmentResolver,
  EquipmentCategoryResolver,
  LanguageResolver,
  MagicSchoolResolver,
  SkillResolver,
  WeaponMasteryPropertyResolver,
  WeaponPropertyResolver
] as const
const fieldResolvers = [
  // Equipment
  ContentFieldResolver,
  ToolResolver,
  DifficultyClassResolver
] as const

export const resolvers = [...collectionResolvers, ...fieldResolvers] as const
