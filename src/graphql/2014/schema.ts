import { buildSchemaSync, NonEmptyArray, ClassType } from 'type-graphql'

import { AlignmentResolver } from './resolvers/AlignmentResolver'
import { ConditionResolver } from './resolvers/ConditionResolver'
import { DamageTypeResolver } from './resolvers/DamageTypeResolver'
import { LanguageResolver } from './resolvers/LanguageResolver'
import { MagicSchoolResolver } from './resolvers/MagicSchoolResolver'
import { RuleSectionResolver } from './resolvers/RuleSectionResolver'
import { WeaponPropertyResolver } from './resolvers/WeaponPropertyResolver'
import { AbilityScoreResolver } from './resolvers/AbilityScoreResolver'
import { SkillResolver } from './resolvers/SkillResolver'
import { EquipmentCategoryResolver } from './resolvers/EquipmentCategoryResolver'
import { RuleResolver } from './resolvers/RuleResolver'
import { FeatResolver, FeatPrerequisiteResolver } from './resolvers/FeatResolver'
import { MagicItemResolver } from './resolvers/magicItemResolver'

// Add newly migrated resolvers to this array
const resolvers = [
  AlignmentResolver,
  ConditionResolver,
  DamageTypeResolver,
  LanguageResolver,
  MagicSchoolResolver,
  RuleSectionResolver,
  WeaponPropertyResolver,
  AbilityScoreResolver,
  SkillResolver,
  EquipmentCategoryResolver,
  RuleResolver,
  FeatResolver,
  FeatPrerequisiteResolver,
  MagicItemResolver
  // ... other migrated resolvers will go here
] as const satisfies NonEmptyArray<ClassType>

// Build the schema synchronously
// Use buildSchema (async) if top-level await is supported or needed
export const schema2014 = buildSchemaSync({
  resolvers: resolvers,
  // Add other options like authChecker, pubSub, etc. if needed later
  validate: false // Disable validation initially
  // TypeGraphQL should automatically discover ObjectTypes implementing interfaces
  // If explicit declaration is needed later, add:
  // orphanedTypes: [MagicItem] // Add types that implement interfaces if auto-detection fails
})
