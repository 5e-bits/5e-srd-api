import { DifficultyClassResolver } from '../common/resolver'
import { AbilityScoreResolver } from './abilityScore/resolver'
import { AlignmentResolver } from './alignment/resolver'
import { BackgroundResolver } from './background/resolver'
import { ConditionResolver } from './condition/resolver'
import { DamageTypeResolver } from './damageType/resolver'
import { ContentFieldResolver, EquipmentResolver, ToolResolver } from './equipment/resolver'
import { EquipmentCategoryResolver } from './equipmentCategory/resolver'
import { FeatResolver } from './feat/resolver'
import { LanguageResolver } from './language/resolver'
import { MagicItemResolver } from './magicItem/resolver'
import { MagicSchoolResolver } from './magicSchool/resolver'
import { ProficiencyResolver } from './proficiency/resolver'
import { SkillResolver } from './skill/resolver'
import { SpeciesResolver } from './species/resolver'
import { SubclassResolver } from './subclass/resolver'
import { SubspeciesResolver } from './subspecies/resolver'
import { TraitResolver } from './trait/resolver'
import { WeaponMasteryPropertyResolver } from './weaponMasteryProperty/resolver'
import { WeaponPropertyResolver } from './weaponProperty/resolver'

const collectionResolvers = [
  AbilityScoreResolver,
  AlignmentResolver,
  BackgroundResolver,
  ConditionResolver,
  DamageTypeResolver,
  EquipmentResolver,
  EquipmentCategoryResolver,
  FeatResolver,
  LanguageResolver,
  MagicItemResolver,
  MagicSchoolResolver,
  ProficiencyResolver,
  SkillResolver,
  SpeciesResolver,
  SubclassResolver,
  SubspeciesResolver,
  TraitResolver,
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
