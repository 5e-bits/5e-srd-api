# Migration to TypeGraphQL + Typegoose

## Current Architecture

- Backend Stack: Express, Mongoose, TypeScript, GraphQL + GraphQL Compose
- Database: MongoDB
- Existing GraphQL implementation using GraphQL Compose
- 26 models in the current codebase
- Single developer team
- Currently running on Node.js 20.x
- 100% test coverage (except GraphQL resolvers)
- Both unit tests and integration tests present

### Infrastructure Components

- Redis caching layer with pre-warming
- Apollo Server with cache control
- GraphQL depth limiting
- Express rate limiting
- Bugsnag error tracking
- CORS support

### Model Complexity Analysis

#### Simple Models (Good Starting Points)

- Alignment (simple enumeration)
- Condition (basic properties)
- DamageType (basic properties)
- Language (basic properties)
- MagicSchool (basic properties)
- RuleSection (basic documentation)
- WeaponProperty (basic properties)
- AbilityScore (simple schema with basic fields)
- Collection (basic organization)
- EquipmentCategory (basic categorization)
- Skill (basic properties with ability score reference)

#### Moderate Complexity Models (Second Phase)

- Background (references and choices)
- Feat (features and prerequisites)
- Rule (documentation and references)
- Trait (race-specific features)
- MagicItem (equipment with magical properties)
- Subrace (race inheritance)

#### Complex Models (Final Phase)

- Class (complex relationships, spellcasting, multi-classing)
- Monster (extensive schema with nested types)
- Race (ability bonuses, proficiencies, traits)
- Spell (complex damage calculations, slot levels)
- Subclass (deep relationships)
- Feature (prerequisites, specific features)
- Level (class-specific features, spellcasting)
- Proficiency (multiple references and types)
- Equipment (various types and properties)

### Custom Scalars

Current implementation includes custom scalar resolvers for:

- Monster Type/Subtype Filters
- Proficiency Type Filters
- Size Filters
- Spell Attack Type Filters
- String Filters
- Action Count
- Area of Effect Type
- Enum Filters
- Float/Int Filters
- Language Script Filters

### Code Organization

- Models and types located in `src/models/2014`
- Resolvers located in `src/graphql/2014/resolvers`
- Custom written resolvers (not using graphql-compose package)
- Uses custom scalars and directives
- Uses graphql-depth-limit middleware

## Migration Goals

- Migrate from GraphQL Compose to TypeGraphQL
- Migrate from Mongoose to Typegoose
- Consolidate model, type, and resolver files into single files for better cohesion
- Maintain existing TypeScript types/interfaces
- Preserve current functionality and test coverage
- No changes to existing schemas, types, or API endpoints
- Preserve caching and middleware functionality

## Implementation Details

### Development Environment

- Using existing Docker Compose setup with:
  - MongoDB (5e-database)
  - Redis cache
  - API service
- Maintaining existing test infrastructure:
  - Separate unit and integration test configurations
  - Jest as testing framework
  - Redis mock for unit tests
  - Existing test coverage requirements
  - *Note: Anticipate minor adjustments to test setup/teardown or mocking strategies when interacting with Typegoose models and TypeGraphQL resolvers.*

### Code Organization

- Main code location: `src/models/2014`
- Resolvers (if needed separately): `src/graphql/2014/resolvers`
- Tests remain in separate files
- Goal: Combine model, type, and resolver files where possible

### Dependency Management

- Update existing package.json
- Add latest compatible versions of:
  - `type-graphql`: 2.0.0-beta.3 # TODO: Confirm latest stable beta
  - `@typegoose/typegoose`: 11.4.1 # TODO: Confirm latest stable
  - `reflect-metadata`: ^0.1.13 (Required peer dependency)
  - Other required peer dependencies (e.g., `graphql`, `class-validator`)
- Maintain Node.js 20.x compatibility
- Preserve existing middleware dependencies

### Infrastructure Preservation

- Redis caching:
  - Maintain current caching strategy
  - Preserve pre-warming functionality
  - Update cache integration tests
- Apollo Server:
  - Migrate cache control plugin
  - Preserve depth limiting
- Express middleware:
  - Maintain rate limiting
  - Preserve error tracking
  - Keep CORS configuration

### Testing Adjustments

While aiming to preserve the existing test infrastructure (Jest, unit/integration separation, Redis mock), some adjustments will be necessary when interacting with Typegoose models and TypeGraphQL resolvers.

#### Mocking Typegoose Models (Unit Tests)

- **Current:** Mongoose models might be mocked using libraries like `jest-mock-extended` or custom factories.
- **New:** Typegoose models, being classes, might require slightly different mocking approaches. Explore using `jest.spyOn` on static methods (like `Alignment.model.find()`) or class methods if applicable. Ensure decorators don't interfere with mocking.
- **Example (Conceptual):**

  ```typescript
  // Example: Mocking a static find method
  jest.spyOn(Alignment.model, 'find').mockResolvedValueOnce([...]);
  ```

#### Updating Integration Test Queries

- **Current:** Integration tests likely use tools like Apollo Client or raw `fetch` to send GraphQL queries based on the GraphQL Compose schema.
- **New:** Queries will need to be updated to reflect the potentially consolidated TypeGraphQL schema structure (e.g., different query names, field structures if consolidation occurred). Ensure tests target the correct endpoint and use the structure defined by TypeGraphQL decorators.
- **Example (Conceptual):**

  ```graphql
  # Old Query (Example)
  query {
    alignmentById(id: "...") { ... }
  }

  # New Query (Example - depends on resolver implementation)
  query {
    alignment(id: "...") { ... } # Might change based on @Query definition
  }
  ```

## Migration Steps

### ✅ Pre-Migration Cleanup

1. Remove deprecated GraphQL Compose dependencies
   - Removed `graphql-compose` and `graphql-compose-mongoose` as they are no longer used
   - Codebase already using custom resolvers without these packages
   - Using `@apollo/server` and `@graphql-tools/schema` for GraphQL implementation

### 1. Initial Setup (Week 1)

1. Add TypeGraphQL and Typegoose dependencies
2. Configure TypeGraphQL with Express
3. Set up basic TypeGraphQL schema structure
4. Create test migration template
5. Configure middleware integration:
   - Apollo Server setup
   - Cache control plugin
   - Depth limiting
   - Rate limiting
   - Error tracking

### 2. Simple Model Migration (Weeks 2-3)

Start with simple models in this order:

1. Alignment (basic enumeration)
2. Condition (basic properties)
3. DamageType (basic properties)
4. Language (basic properties)
5. MagicSchool (basic properties)
6. RuleSection (basic documentation)
7. WeaponProperty (basic properties)
8. Collection (basic organization)
9. EquipmentCategory (basic categorization)
10. AbilityScore (foundation for many other models)
11. Skill (basic properties with ability score reference)

For each model:

1. Create new TypeGraphQL + Typegoose implementation
   *(See Appendix A: Example Simple Model Migration for a template)*
2. Update/migrate existing tests
3. Direct replacement of old implementation
4. Verify functionality
5. Deploy to production

### 3. Moderate Complexity Migration (Weeks 4-5)

Handle models with moderate complexity:

1. Background (references and choices)
2. Feat (features and prerequisites)
3. Rule (documentation and references)
4. Trait (race-specific features)
5. MagicItem (equipment with magical properties)
6. Subrace (race inheritance)

For each model:

1. Analyze references and dependencies
2. Create new implementation
3. Migrate tests
4. Verify functionality with related models
5. Deploy to production

### 4. Complex Model Migration (Weeks 6-8)

Handle complex models in this order:

1. Equipment (foundation for items and weapons)
2. Proficiency (references to other models)
3. Feature (prerequisites)
4. Race (ability bonuses)
5. Spell (damage calculations)
6. Level (class features)
7. Class (spellcasting)
8. Subclass (relationships)
9. Monster (comprehensive schema)

For each model:

1. Analyze dependencies
2. Create new implementation
3. Migrate tests
4. Verify relationships with other models
5. Deploy to production

### 5. Infrastructure Migration (Week 9)

1. Port custom scalars to TypeGraphQL
   - Strategy: Wrap existing scalar logic using TypeGraphQL's `GraphQLScalarType` where possible. Rewrite if necessary for better integration or type safety.
   - Verify behavior, especially for filter-related scalars.
2. Update Redis caching implementation
3. Migrate Apollo Server configuration
4. Update middleware setup
5. Verify all infrastructure components

### 6. Final Steps (Week 10)

1. Remove old dependencies
2. Clean up unused code
3. Update documentation
4. Final testing pass
5. Production deployment

## Risks and Mitigations

### 1. Data Integrity

- Risk: Schema changes affecting existing data
- Mitigation:
  - Maintain schema compatibility
  - Thorough testing with production data
  - Direct replacement strategy

### 2. Performance

- Risk: New implementation affecting query performance
- Mitigation:
  - Performance testing before deployment
  - Maintain existing Redis cache
  - Monitor query execution times

### 3. Service Availability

- Risk: Migration affecting production service
- Mitigation:
  - One model at a time migration strategy.
  - Immediate rollback capability: Maintain the ability to quickly revert code changes for a specific model if critical issues are found post-deployment.
    - **Identify Commits:** Ensure migration commits are clearly identifiable (e.g., per-model commits).
    - **Revert Code:** Use `git checkout <last_good_commit_hash> -- src/models/2014/ModelName.ts src/graphql/2014/resolvers/modelNameResolver.ts` (adjust paths as needed) to revert the specific model files.
    - **Verify Database:** Confirm the database schema remains backwards-compatible during the transition phase to avoid data loss upon rollback.
    - **Deploy Reverted Code:** Redeploy the application with the reverted code.
  - Comprehensive testing before deployment.

### 4. Testing Coverage

- Risk: Missing edge cases during migration
- Mitigation:
  - Maintain separate test files
  - Keep existing test infrastructure
  - Verify coverage for each migration

### 5. Caching and Performance

- Risk: Cache invalidation issues during migration
- Mitigation:
  - Maintain existing cache keys
  - Verify cache behavior for each model
  - Comprehensive cache integration tests

### 6. Middleware Integration

- Risk: Middleware incompatibilities with new setup
- Mitigation:
  - Test middleware in isolation
  - Verify rate limiting effectiveness
  - Maintain error tracking coverage

## Success Criteria

1. All models migrated to TypeGraphQL + Typegoose
2. All tests passing with existing coverage
3. No regression in API functionality
4. Maintained performance metrics
5. Clean, consolidated codebase
6. Fully functional caching layer
7. All middleware operating correctly

## Appendix A: Example Simple Model Migration (Alignment)

This appendix demonstrates the migration of a simple model, `Alignment`, from the old Mongoose + GraphQL Compose setup to TypeGraphQL + Typegoose.

### Old Implementation (Conceptual)

- `src/models/2014/Alignment.ts` (Mongoose Schema/Model)
- `src/graphql/2014/types/AlignmentType.ts` (GraphQL Compose Type)
- `src/graphql/2014/resolvers/alignmentResolver.ts` (GraphQL Compose Resolver)

### New Implementation (Consolidated)

```typescript
// src/models/2014/Alignment.ts
import { ObjectType, Field, ID } from 'type-graphql';
import { prop as Property, getModelForClass } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';

@ObjectType({ description: 'Represents a creature\'s moral and ethical outlook.' })
export class Alignment extends Base<string> { // Extend Base for _id
  @Field(() => ID)
  get id(): string { // Use getter for TypeGraphQL ID compatibility
    return this._id;
  }

  @Field({ description: 'The name of the alignment (e.g., Lawful Good, Chaotic Evil).' })
  @Property({ required: true, index: true, unique: true })
  name!: string;

  @Field({ description: 'A shortened representation of the alignment (e.g., LG, CE).' })
  @Property({ required: true })
  abbreviation!: string;

  @Field({ description: 'A brief description of the alignment.' })
  @Property({ required: true })
  desc!: string;

  // Typegoose Model - export this for database interactions
  static get model() {
    return getModelForClass(Alignment, { schemaOptions: { collection: 'alignments' } });
  }
}

// Placeholder for potential Resolver (if needed, could be in the same file)
/*
import { Resolver, Query, Arg } from 'type-graphql';

@Resolver(Alignment)
export class AlignmentResolver {
  @Query(() => [Alignment])
  async alignments(): Promise<Alignment[]> {
    return Alignment.model.find().lean();
  }

  @Query(() => Alignment, { nullable: true })
  async alignment(@Arg('id', () => ID) id: string): Promise<Alignment | null> {
    // Basic example, error handling and more specific logic would be needed
    return Alignment.model.findById(id).lean();
  }
}
*/
```

**Key Changes & Considerations:**

1. **Consolidation:** Model definition (`@ObjectType`, `@Field`) and database schema (`@Property`) are combined in one file using decorators.
2. **TypeGraphQL Decorators:** `@ObjectType` and `@Field` define the GraphQL schema.
3. **Typegoose Decorators:** `@Property` defines the MongoDB schema and validation.
4. **`_id` Handling:** Typegoose uses `_id`. A getter `id` annotated with `@Field(() => ID)` is added for GraphQL compatibility. The `Base<string>` extension provides the `_id` field.
5. **Model Export:** `getModelForClass` creates the Typegoose model, exported as `Alignment.model` for database operations.
6. **Resolver (Optional):** A basic resolver (`AlignmentResolver`) can be included in the same file or kept separate. The example above shows it commented out for brevity but demonstrates how `@Resolver` and `@Query` would be used.
7. **Dependencies:** Assumes `type-graphql`, `@typegoose/typegoose`, and `reflect-metadata` are installed and configured.

## Appendix B: Example Complex Model Migration (Monster)

This appendix outlines the potential migration strategy for a complex model like `Monster`, known for its extensive schema and nested data structures.

**Old Implementation (Conceptual)**

*   `src/models/2014/Monster.ts` (Mongoose Schema/Model)
*   Potentially multiple files for sub-documents/types
*   `src/graphql/2014/types/MonsterType.ts` (GraphQL Compose Type)
*   `src/graphql/2014/resolvers/monsterResolver.ts` (GraphQL Compose Resolver)

**New Implementation (Consolidated Snippet)**

```typescript
// src/models/2014/Monster.ts
import { ObjectType, Field, ID, Float, Int } from 'type-graphql';
import { prop as Property, getModelForClass, Ref } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { AbilityScore } from './AbilityScore'; // Assuming AbilityScore is migrated
import { Skill } from './Skill'; // Assuming Skill is migrated

// Example Nested Object Type for Actions
@ObjectType({ description: 'An action a monster can perform' })
class MonsterAction {
  @Field()
  @Property({ required: true })
  name!: string;

  @Field()
  @Property({ required: true })
  desc!: string;

  // Other action-specific fields like attack_bonus, damage_dice, etc.
}

// Example Nested Object Type for Special Abilities
@ObjectType({ description: 'A special ability of the monster' })
class SpecialAbility {
  @Field()
  @Property({ required: true })
  name!: string;

  @Field()
  @Property({ required: true })
  desc!: string;

  // Other ability-specific fields
}


@ObjectType({ description: 'Represents a creature from the D&D SRD.' })
export class Monster extends Base<string> {
  @Field(() => ID)
  get id(): string {
    return this._id;
  }

  @Field({ description: 'The name of the monster.' })
  @Property({ required: true, index: true, unique: true })
  name!: string;

  @Field({ description: 'Size category (e.g., Medium, Large).' })
  @Property({ required: true })
  size!: string; // Could potentially be an Enum

  @Field({ description: 'Creature type (e.g., Aberration, Beast).' })
  @Property({ required: true })
  type!: string; // Could potentially be an Enum

  @Field({ nullable: true, description: 'Creature subtype (e.g., Goblinoid).' })
  @Property()
  subtype?: string;

  @Field(() => Int, { description: 'Armor Class.' })
  @Property({ required: true })
  armor_class!: number;

  @Field(() => Int, { description: 'Hit Points.' })
  @Property({ required: true })
  hit_points!: number;

  @Field({ description: 'Hit Dice (e.g., 4d8).' })
  @Property({ required: true })
  hit_dice!: string;

  // --- Stats ---
  @Field(() => Int) @Property({ required: true }) strength!: number;
  @Field(() => Int) @Property({ required: true }) dexterity!: number;
  @Field(() => Int) @Property({ required: true }) constitution!: number;
  @Field(() => Int) @Property({ required: true }) intelligence!: number;
  @Field(() => Int) @Property({ required: true }) wisdom!: number;
  @Field(() => Int) @Property({ required: true }) charisma!: number;

  // --- References (Example) ---
  // Assuming Proficiency model is migrated and holds proficiency bonus calculation
  // @Field(() => Proficiency)
  // @Property({ ref: () => Proficiency })
  // proficiency_bonus_ref?: Ref<Proficiency>;

  // --- Nested Types ---
  @Field(() => [MonsterAction], { description: 'Actions the monster can take.' })
  @Property({ type: () => [MonsterAction], default: [] })
  actions?: MonsterAction[];

  @Field(() => [SpecialAbility], { description: 'Special abilities of the monster.' })
  @Property({ type: () => [SpecialAbility], default: [] })
  special_abilities?: SpecialAbility[];

  // ... other numerous fields like speed, senses, languages, challenge_rating, skills, saving throws, condition_immunities etc.

  // Typegoose Model
  static get model() {
    // Note: May need explicit schema options for complex relations if not automatically inferred
    return getModelForClass(Monster, { schemaOptions: { collection: 'monsters' } });
  }
}

// Placeholder for potential Monster Resolver (likely complex)
/*
import { Resolver, Query, Arg, FieldResolver, Root } from 'type-graphql';

@Resolver(Monster)
export class MonsterResolver {
  @Query(() => [Monster])
  async monsters(/* Add Filtering Arguments using Custom Scalars/Inputs *): Promise<Monster[]> {
    // Complex query logic with population for references
    return Monster.model.find({ /* filter criteria * }).populate(/* refs *).lean();
  }

  @Query(() => Monster, { nullable: true })
  async monster(@Arg('id', () => ID) id: string): Promise<Monster | null> {
    return Monster.model.findById(id).populate(/* refs *).lean();
  }

  // Example Field Resolver if needed (e.g., calculating proficiency bonus)
  // @FieldResolver(() => Int)
  // async proficiency_bonus(@Root() monster: Monster): Promise<number> {
  //   // Logic to calculate based on challenge rating or other factors
  // }
}
*/
```

**Key Changes & Considerations:**

1.  **Nested Types:** Structures like `actions` or `special_abilities` are defined as separate classes decorated with `@ObjectType` and `@Field`, and then used as types within the main `Monster` class (`@Field(() => [MonsterAction])`). Typegoose needs `@Property({ type: () => [NestedType] })` to handle the array of sub-documents.
2.  **Extensive Fields:** All fields require both `@Field` (for GraphQL) and `@Property` (for Typegoose/MongoDB). Careful attention must be paid to types (`Int`, `Float`, `String`, custom Enums, etc.).
3.  **Relationships (`Ref`):** References to other models (like `Proficiency`, `Skill`, `AbilityScore`) will use Typegoose's `Ref` type (`@Property({ ref: () => OtherModel })`) and likely require population in resolvers. The corresponding `@Field` needs to resolve to the correct GraphQL type.
4.  **Complexity:** The sheer number of fields and potential interdependencies makes this migration time-consuming and requires thorough testing.
5.  **Resolvers:** Monster resolvers will likely be complex, involving argument handling (potentially using custom filter scalars/inputs), population of referenced documents, and potentially custom field resolvers for calculated values.
6.  **Enums:** Fields like `size` and `type` could be implemented using TypeScript enums registered with TypeGraphQL (`registerEnumType`).

---

## Appendix C: Example Custom Scalar / Input Type Migration (StringFilterInput)

This appendix provides a conceptual example of how a custom filter, previously implemented as a custom scalar (like the listed `String Filters`), might be migrated or represented in TypeGraphQL, often using custom Input Types for better structure and validation.

**Old Implementation (Conceptual)**

*   A custom GraphQL scalar type definition (e.g., `StringFilterScalar`) used directly in resolver arguments.
*   Resolver logic to parse the scalar's input value and apply database filtering (e.g., regex, equality checks).

**New Implementation (Using InputType)**

Instead of a raw custom scalar, TypeGraphQL often encourages using `@InputType` for complex input objects, which can include fields for various filter conditions. This leverages built-in validation.

```typescript
// src/graphql/inputs/StringFilterInput.ts (Example Location)
import { InputType, Field } from 'type-graphql';
import { Length, IsOptional } from 'class-validator'; // Example validation

@InputType({ description: 'Input for filtering strings.' })
export class StringFilterInput {
  @Field(() => String, { nullable: true, description: 'Matches exact string.' })
  @IsOptional()
  eq?: string;

  @Field(() => String, { nullable: true, description: 'Matches strings containing the value.' })
  @IsOptional()
  contains?: string;

  @Field(() => String, { nullable: true, description: 'Matches strings starting with the value.' })
  @IsOptional()
  startsWith?: string;

  @Field(() => String, { nullable: true, description: 'Matches strings ending with the value.' })
  @IsOptional()
  endsWith?: string;

  @Field(() => [String], { nullable: true, description: 'Matches any string in the list.' })
  @IsOptional()
  in?: string[];

  // Add other conditions as needed (regex, not equals, etc.)
}


// Example Usage in a Resolver:
/*
import { Resolver, Query, Arg } from 'type-graphql';
import { Monster } from '../../models/2014/Monster'; // Assuming Monster model
import { StringFilterInput } from '../inputs/StringFilterInput';

@Resolver(Monster)
export class MonsterResolver {

  @Query(() => [Monster])
  async monsters(
    @Arg('nameFilter', () => StringFilterInput, { nullable: true }) nameFilter?: StringFilterInput
  ): Promise<Monster[]> {
    const queryFilter: any = {}; // Build MongoDB query filter

    if (nameFilter) {
      if (nameFilter.eq !== undefined) queryFilter.name = nameFilter.eq;
      if (nameFilter.contains !== undefined) queryFilter.name = { $regex: new RegExp(nameFilter.contains, 'i') }; // Case-insensitive contains
      if (nameFilter.startsWith !== undefined) queryFilter.name = { $regex: new RegExp(`^${nameFilter.startsWith}`, 'i') };
      if (nameFilter.endsWith !== undefined) queryFilter.name = { $regex: new RegExp(`${nameFilter.endsWith}$`, 'i') };
      if (nameFilter.in !== undefined) queryFilter.name = { $in: nameFilter.in };
      // ... handle other filter conditions
    }

    console.log('Applying filter:', queryFilter);
    return Monster.model.find(queryFilter).lean();
  }

  // ... other monster queries/mutations/resolvers
}
*/
```

**Key Changes & Considerations:**

1.  **`@InputType`:** Define a class decorated with `@InputType` to represent the structure of the filter arguments. Each possible filter condition (`eq`, `contains`, etc.) becomes a field decorated with `@Field`.
2.  **Nullability:** Fields are typically nullable (`nullable: true`) so users only provide the conditions they need.
3.  **Validation:** Leverage `class-validator` decorators (like `@Length`, `@IsOptional`, `@IsEnum`) within the `@InputType` class for automatic input validation.
4.  **Resolver Arguments:** Use the `@InputType` class as the type for arguments in your resolvers (`@Arg('filter', () => StringFilterInput)`).
5.  **Query Building:** Resolver logic needs to inspect the fields of the input object and construct the appropriate database query (e.g., MongoDB filter document).
6.  **Alternative (True Custom Scalar):** While `@InputType` is often preferred for structured filters, if you need a *true* custom scalar (e.g., for a specific data format like `DateOnly`), you would define a `GraphQLScalarType` object (from the `graphql` package) and potentially create a TypeScript type/interface for it. You'd then reference this scalar in `@Field` or `@Arg` using `() => GraphQLScalarTypeObject`. TypeGraphQL documentation provides guidance on integrating custom scalars.
7.  **Reusability:** Define these `InputType` classes once and reuse them across different resolvers where the same filtering logic is needed.

---
