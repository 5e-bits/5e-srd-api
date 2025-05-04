// This file will export an array of all resolver classes
import { AlignmentResolver } from './alignmentResolver'
import { ConditionResolver } from './conditionResolver'
import { DamageTypeResolver } from './damageTypeResolver'
import { LanguageResolver } from './languageResolver'
import { MagicSchoolResolver } from './magicSchoolResolver'
import { RuleSectionResolver } from './ruleSectionResolver'
import { WeaponPropertyResolver } from './weaponPropertyResolver'

export const resolvers = [
  AlignmentResolver,
  ConditionResolver,
  DamageTypeResolver,
  LanguageResolver,
  MagicSchoolResolver,
  RuleSectionResolver,
  WeaponPropertyResolver
] as const

// For now, export an empty array until resolvers are created
// export const resolvers: Function[] = []; // Original empty array
