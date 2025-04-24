import { buildSchemaSync, NonEmptyArray, ClassType } from 'type-graphql'

// Migrated Resolvers
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
import { MagicItemResolver } from './resolvers/MagicItemResolver'

// Common Object Types (Import from barrel file)
import * as Objects from '../common/objects'

// OptionSet Object Types (Import from barrel file)
import * as OptionSetTypes from '../common/options/optionSetTypes'

// Option Object Types (Import from barrel file)
import * as OptionTypes from '../common/options/optionTypes'

// Array of migrated resolvers
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
] as const satisfies NonEmptyArray<ClassType>

// Array of object types needed for unions/interfaces but not directly resolved
const orphanedTypes = [
  // Objects
  Objects.APIReferenceObject,
  Objects.DamageObject,
  Objects.DifficultyClassObject,
  Objects.ChoiceObject,
  // OptionSet Types
  OptionSetTypes.EquipmentCategoryOptionSetObject,
  OptionSetTypes.ResourceListOptionSetObject,
  OptionSetTypes.OptionsArrayOptionSetObject,
  // Option Types
  OptionTypes.ReferenceOptionObject,
  OptionTypes.ActionOptionObject,
  OptionTypes.MultipleOptionObject,
  OptionTypes.StringOptionObject,
  OptionTypes.IdealOptionObject,
  OptionTypes.CountedReferenceOptionObject,
  OptionTypes.ScorePrerequisiteOptionObject,
  OptionTypes.AbilityBonusOptionObject,
  OptionTypes.BreathOptionObject,
  OptionTypes.DamageOptionObject,
  OptionTypes.ChoiceOptionObject
]

// Build the schema
export const schema2014 = buildSchemaSync({
  resolvers: resolvers,
  orphanedTypes: orphanedTypes,
  validate: false
})
