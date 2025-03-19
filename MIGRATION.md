# Migration Plan: Mongoose + GraphQL → TypeGraphQL + Typegoose

## Overview

This document outlines the plan to migrate the 5e-srd-api from its current Mongoose + GraphQL implementation to TypeGraphQL + Typegoose. This migration will help reduce boilerplate code, improve type safety, and make the codebase more maintainable.

## Prerequisites

### Dependencies to Add

```bash
npm install --save type-graphql @typegoose/typegoose class-validator reflect-metadata
```

### TypeScript Configuration

Ensure `tsconfig.json` has the following options enabled:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## Migration Phases

### Phase 1: Setup and Infrastructure (1-2 days)

1. Create new directory structure:

   ```plaintext
   src/
   ├── models/           # Typegoose models with TypeGraphQL decorators
   │   └── 2014/        # Keep existing version organization
   └── graphql/         # TypeGraphQL resolvers, inputs, and scalars
       └── 2014/       # Keep existing version organization
   ```

2. Set up base configuration files:
   - Create TypeGraphQL schema builder in `src/graphql/schema.ts`:

     ```typescript
     import { buildSchema } from 'type-graphql';
     import { resolvers } from './2014/resolvers';

     export const createSchema = async () => {
       return buildSchema({
         resolvers,
         validate: true,
         dateScalarMode: 'timestamp',
         // Register custom scalars
         scalarsMap: [
           // ... your existing scalar mappings
         ],
       });
     };
     ```

   - Set up Typegoose connection
   - Configure dependency injection if needed

### Phase 2: Core Type Migration (2-3 days)

1. Migrate common types and enums:
   - Move from `src/models/2014/common/types.ts` to new structure
   - Convert to TypeGraphQL decorators
   - Create shared interfaces and types

2. Create base interfaces/abstract classes:
   - Equipment interfaces:
     - `IEquipmentBase` (base interface with index, name, desc, url)
     - `IEquipment` (extends IEquipmentBase, adds cost, category, weight)
     - `IGear` (extends IEquipment, for gear-specific properties)

   - Common types and interfaces:
     - `APIReference` (index, name, url pattern)
     - `AreaOfEffect` (type and size for spells)
     - `Choice` (choose, from, type pattern)
     - `Cost` (quantity and unit)
     - `DC` (difficulty class with type, value, success)
     - `Damage` (damage type and dice values)
     - `DamageAtLevel` (level-based damage scaling)
     - `Usage` (times, type, dice values for features)
     - `Prerequisite` (base for all prerequisites)
     - `SpellPrerequisite` (for spell requirements)
     - `LevelPrerequisite` (for level requirements)
     - `ProficiencyPrerequisite` (for proficiency requirements)
     - `AbilityScorePrerequisite` (for ability score requirements)

### Phase 3: Model Migration (4-5 days)

1. Start with independent models (no relations):
   - AbilityScore
   - DamageType
   - MagicSchool
   - Language
   - Condition
   - Alignment
   - WeaponProperty
   - RuleSection
   - Rule
   - Collection

2. Move to models with simple relations:
   - Equipment
   - EquipmentCategory
   - Proficiency
   - Skill
   - MagicItem
   - Background

3. Complex models with nested relations:
   - Spell
   - Class
   - Subclass
   - Race
   - Subrace
   - Monster
   - Feature
   - Feat
   - Trait
   - Level

For each model:

1. Create entity class with `@ObjectType()` and `@prop()`
2. Move validation logic to class-validator decorators
3. Define relations using Typegoose references
4. Add TypeGraphQL field resolvers where needed

Example model migration:

```typescript
// Before (Mongoose)
const Spell = new Schema({
  index: { type: String, index: true },
  name: { type: String, index: true },
  desc: { type: [String], index: true },
  // ...
});

// After (Typegoose + TypeGraphQL)
@ObjectType()
@modelOptions({ schemaOptions: { collection: '2014-spells' } })
export class Spell {
  @Field()
  @prop({ index: true })
  index: string;

  @Field()
  @prop({ index: true })
  name: string;

  @Field(() => [String])
  @prop({ index: true })
  desc: string[];
  // ...
}
```

### Phase 4: Resolver Migration (3-4 days)

1. Create base resolver classes for common operations
2. Migrate resolvers in parallel with models:
   - Convert to TypeGraphQL decorators
   - Use dependency injection for services
   - Implement field resolvers using new entity classes

Example resolver migration:

```typescript
// Before
const Spell = {
  attack_type: (spell) => spell.attack_type?.toUpperCase() || null,
  // ...
};

// After
@Resolver(() => Spell)
export class SpellResolver {
  @FieldResolver(() => SpellAttackType, { nullable: true })
  attackType(@Root() spell: Spell): SpellAttackType | null {
    return spell.attackType?.toUpperCase() || null;
  }
  // ...
}
```

### Phase 5: Query Migration (2-3 days)

1. Convert existing query resolvers to TypeGraphQL
2. Implement proper input types for filters
3. Migrate sorting and pagination logic
4. Add proper return types and nullability

### Phase 6: Testing and Validation (2-3 days)

1. Update existing tests to work with new structure
2. Add new tests for TypeGraphQL-specific features
3. Verify all queries work as expected
4. Test performance and optimize if needed

### Phase 7: Cleanup (1-2 days)

1. Remove old Mongoose schemas
2. Remove old GraphQL type definitions
3. Remove old resolvers
4. Update documentation
5. Clean up dependencies

## Timeline

Estimated total time: 15-22 days

## Risks and Mitigation

### Risks

1. Breaking changes in API responses
2. Performance impact during transition
3. Complex circular dependencies
4. Data migration needs

### Mitigation Strategies

1. Run old and new implementations in parallel
2. Comprehensive testing before each phase
3. Clear separation of concerns in new architecture
4. Careful handling of backwards compatibility

## Benefits

1. **Type Safety**
   - Full end-to-end type safety
   - Better IDE support
   - Catch errors at compile time

2. **Code Reduction**
   - Eliminate duplicate type definitions
   - Reduce boilerplate code
   - Single source of truth for types

3. **Maintainability**
   - Clear separation of concerns
   - Better code organization
   - Easier to add new features

4. **Developer Experience**
   - Better autocomplete
   - Easier debugging
   - More intuitive API design

## Rollback Plan

1. Keep old implementation files until fully tested
2. Maintain database compatibility
3. Document all changes for potential rollback

## Post-Migration Tasks

1. Update API documentation
2. Performance monitoring
3. Developer training
4. Clean up deprecated code
5. Update deployment scripts

## Success Criteria

1. All existing functionality works as expected
2. No regression in performance
3. Reduced codebase size
4. Improved type safety
5. All tests passing
6. Documentation updated
