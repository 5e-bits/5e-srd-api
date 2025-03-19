# Migration to TypeGraphQL

This document tracks the migration of the 5e SRD API from separate Mongoose models, TypeScript types, and GraphQL resolvers to a unified TypeGraphQL implementation.

## Overview

The current codebase maintains three separate definitions for each entity:
1. Mongoose models (`src/models/2014/*/index.ts`)
2. TypeScript types (`src/models/2014/*/types.d.ts`)
3. GraphQL resolvers (`src/graphql/2014/resolvers/*.ts`)

This migration will consolidate these into a single source of truth using TypeGraphQL decorators.

## Prerequisites

1. Install required packages:
```bash
npm install type-graphql @typegoose/typegoose class-validator class-transformer
```

2. Update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## Migration Phases

### Phase 1: Setup and Infrastructure

- [ ] Create new directory structure for TypeGraphQL models
- [ ] Set up TypeGraphQL base configuration
- [ ] Create shared decorators and utilities
- [ ] Update build and test configurations

### Phase 2: Model Migration

Models will be migrated in order of complexity and dependencies:

1. Simple Models (no nested objects):
   - [ ] MagicSchool
   - [ ] Alignment
   - [ ] DamageType
   - [ ] Condition
   - [ ] Language
   - [ ] WeaponProperty
   - [ ] AbilityScore
   - [ ] Skill
   - [ ] RuleSection
   - [ ] Collection

2. Models with Basic References:
   - [ ] EquipmentCategory
   - [ ] Proficiency
   - [ ] Feature
   - [ ] Background
   - [ ] Feat
   - [ ] Rule
   - [ ] MagicItem
   - [ ] Level
   - [ ] Trait

3. Equipment Models:
   - [ ] Equipment (base)
   - [ ] Weapon
   - [ ] Armor
   - [ ] Gear
   - [ ] Tool
   - [ ] Pack
   - [ ] Ammunition
   - [ ] Vehicle

4. Complex Models:
   - [ ] Class
   - [ ] ClassSpecific
   - [ ] Subclass
   - [ ] SubclassSpecific
   - [ ] Race
   - [ ] Subrace
   - [ ] Spell
   - [ ] Monster
   - [ ] StartingEquipment

### Phase 3: Resolver Migration

1. Base Resolvers:
   - [ ] Create base resolver class
   - [ ] IEquipmentBase resolver
   - [ ] IEquipment resolver
   - [ ] IGear resolver
   - [ ] Common resolvers

2. Simple Model Resolvers:
   - [ ] MagicSchoolResolver
   - [ ] LanguageResolver
   - [ ] AbilityScoreResolver
   - [ ] SkillResolver
   - [ ] RuleResolver
   - [ ] WeaponPropertyResolver

3. Equipment Resolvers:
   - [ ] EquipmentCategoryResolver
   - [ ] EquipmentMultipleItemResolver
   - [ ] EquipmentOptionResolver
   - [ ] WeaponResolver
   - [ ] ArmorResolver
   - [ ] GearResolver
   - [ ] ToolResolver
   - [ ] PackResolver
   - [ ] AmmunitionResolver
   - [ ] VehicleResolver

4. Complex Model Resolvers:
   - [ ] ClassResolver
   - [ ] ClassSpecificResolver
   - [ ] SubclassResolver
   - [ ] SubclassSpecificResolver
   - [ ] RaceResolver
   - [ ] SubraceResolver
   - [ ] SpellResolver
   - [ ] SpellPrerequisiteResolver
   - [ ] MonsterResolver
   - [ ] MonsterActionOptionResolver
   - [ ] BackgroundResolver
   - [ ] FeatureResolver
   - [ ] FeatResolver
   - [ ] TraitResolver
   - [ ] ProficiencyResolver
   - [ ] ProficiencyOptionResolver
   - [ ] ProficiencyRaceResolver
   - [ ] ProficiencyReferenceResolver
   - [ ] ExpertiseOptionResolver
   - [ ] StartingEquipmentOptionSetResolver

5. Root Resolvers:
   - [ ] QueryResolver
   - [ ] RootResolvers

6. Custom Scalar Resolvers:
   - [ ] Migrate all custom scalar types

### Phase 4: Schema and Type Updates

- [ ] Update GraphQL schema generation
- [ ] Remove old type definitions
- [ ] Update import paths across the codebase

## Migration Steps for Each Model

For each model, follow these steps:

1. Create new TypeGraphQL model:
```typescript
@ObjectType()
export class ModelName {
  @Field(() => ID)
  @Property({ required: true })
  _id: string;

  // ... other fields
}
```

2. Create resolver:
```typescript
@Resolver(ModelName)
export class ModelNameResolver {
  @Query(() => ModelName)
  async modelName(@Arg('index') index: string) {
    return await ModelNameModel.findOne({ index });
  }
}
```

3. Update imports and references
4. Remove old files:
   - `src/models/2014/modelName/index.ts`
   - `src/models/2014/modelName/types.d.ts`
   - `src/graphql/2014/resolvers/modelNameResolver.ts`

## Breaking Changes

1. GraphQL Schema Changes:
   - Field names may change to match TypeScript naming conventions
   - Some type definitions may be simplified
   - Input types will be generated automatically

2. API Changes:
   - Query/mutation names may change
   - Response structure may be modified
   - Filter types will be updated

## Testing Strategy

1. Unit Tests:
   - Test each model's decorators
   - Test resolver methods
   - Test validation rules

2. Integration Tests:
   - Test GraphQL queries
   - Test database operations
   - Test type generation

3. End-to-End Tests:
   - Test complete API flows
   - Test client integrations

## Rollback Plan

1. Keep old files with `.old` extension during migration
2. Maintain separate git branch for migration
3. Document all changes in commits
4. Create database backup before deployment

## Timeline

- Phase 1: 1 week
- Phase 2: 2-3 weeks
- Phase 3: 1-2 weeks
- Phase 4: 1 week

Total estimated time: 5-7 weeks

## Dependencies

- TypeGraphQL
- TypeGoose
- class-validator
- class-transformer
- GraphQL
- Mongoose

## Notes

- Keep old implementation until all models are migrated
- Test each model migration thoroughly
- Update documentation as models are migrated
- Consider performance implications of decorators

## Resources

- [TypeGraphQL Documentation](https://typegraphql.com/)
- [TypeGoose Documentation](https://typegoose.github.io/typegoose/)
- [GraphQL Schema Design](https://graphql.org/learn/schema/)
