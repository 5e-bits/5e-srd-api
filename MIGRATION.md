# Migration to TypeGraphQL from GraphQL Compose

## Current Architecture

- Backend Stack: Express, Typegoose, TypeScript, GraphQL + GraphQL Compose
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

### Model Complexity Analysis (for GraphQL Exposure)

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

*(These will need to be ported or adapted for TypeGraphQL)*

### Code Organization

- Models (Typegoose) located in `src/models/2014`
- GraphQL artifacts (Types, Resolvers) previously in `src/graphql/2014/{types,resolvers}`

## Migration Goals

- Migrate from GraphQL Compose to TypeGraphQL
- Define GraphQL Object Types and Resolvers using TypeGraphQL decorators.
- Potentially consolidate GraphQL Object Type definitions and Resolvers into fewer files, possibly alongside the relevant Typegoose model file.
- Maintain existing TypeScript types/interfaces where applicable (Typegoose classes serve as the base).
- Preserve current functionality and test coverage (adapting tests for TypeGraphQL).
- No changes to the underlying database schema or data access logic (handled by Typegoose).

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
  - *Note: Anticipate adjustments to integration tests to match the new TypeGraphQL schema structure and query/mutation definitions.*

### Code Organization

- Typegoose Models remain in: `src/models/2014`
- New TypeGraphQL Resolvers can be located in: `src/graphql/2014/resolvers` or potentially co-located with models in `src/models/2014` if preferred.
- Tests remain in separate files.
- Goal: Define GraphQL schema using TypeGraphQL decorators, potentially colocating related GraphQL types/resolvers.

### Dependency Management

- Update existing package.json
- Add latest compatible versions of:
  - `type-graphql`: 2.0.0-beta.3 # TODO: Confirm latest stable beta
  - `reflect-metadata`: ^0.1.13 (Required peer dependency)
  - Other required peer dependencies (e.g., `graphql`, `class-validator`)
- Maintain Node.js 20.x compatibility

### Testing Adjustments

While aiming to preserve the existing test infrastructure (Jest, unit/integration separation, Redis mock), adjustments will be necessary primarily for integration tests interacting with the TypeGraphQL API.

#### Unit Tests (Minimal Impact)

- Unit tests for services or logic interacting directly with Typegoose models should remain largely unchanged, as the data layer is not migrating.

#### Updating Integration Test Queries

- **Current:** Integration tests likely use tools like Apollo Client or raw `fetch` to send GraphQL queries based on the GraphQL Compose schema.
- **New:** Queries and mutations will need to be updated to reflect the TypeGraphQL schema structure (e.g., different query/mutation names defined by `@Query`/`@Mutation`, field structures defined by `@Field`, argument structures defined by `@Arg` and `@InputType`). Ensure tests target the correct endpoint and use the structure defined by TypeGraphQL decorators.
- **Example (Conceptual):**

  ```graphql
  query {
    alignment(id: "...") { ... }
  }
  ```

## Migration Steps

### ✅ Pre-Migration Cleanup

1. Remove deprecated GraphQL Compose dependencies
   - Ensure `graphql-compose` and related packages are removed.
   - Confirm the setup relies on `@apollo/server`, `@graphql-tools/schema`, and custom resolvers.

### 1. Initial Setup (Week 1)

1. Add TypeGraphQL dependencies (`type-graphql`, `reflect-metadata`, `class-validator`).
2. Configure TypeGraphQL with Express/Apollo Server.
   - Set up `buildSchema` from `type-graphql`.
   - Integrate the generated schema with Apollo Server.
3. Create a template for migrating a resolver/type.
4. Configure middleware integration with the new TypeGraphQL setup:
   - Ensure Apollo Server cache control, depth limiting, rate limiting, error tracking, etc., work with the TypeGraphQL schema.

### 2. Simple Model GraphQL Migration (Weeks 2-3)

Migrate the GraphQL layer for simple models first (Models themselves are already Typegoose):

1. Alignment
2. Condition
3. DamageType
4. Language
5. MagicSchool
6. RuleSection
7. WeaponProperty
8. Collection
9. EquipmentCategory
10. AbilityScore
11. Skill

For each model:

1. Define the TypeGraphQL `@ObjectType` (likely augmenting the existing Typegoose class).
2. Create the TypeGraphQL `@Resolver` class with `@Query` and `@Mutation` methods.
   *(See Appendix A: Example Simple Model GraphQL Migration for a template)*
3. Replace the old GraphQL Compose type/resolver files/logic with the new TypeGraphQL implementation.
4. Update/migrate existing integration tests targeting the GraphQL API for this model.
5. Verify GraphQL functionality through testing.
6. Deploy to production.

### 3. Moderate Complexity GraphQL Migration (Weeks 4-5)

Migrate GraphQL layer for models with moderate complexity:

1. Background
2. Feat
3. Rule
4. Trait
5. MagicItem
6. Subrace

For each model:

1. Analyze GraphQL dependencies (e.g., does the Background resolver need Feat types?).
2. Define TypeGraphQL `@ObjectType` and `@Resolver`.
3. Migrate integration tests.
4. Verify functionality via GraphQL endpoint.
5. Deploy to production.

### 4. Complex Model GraphQL Migration (Weeks 6-8)

Migrate GraphQL layer for complex models:

1. Equipment
2. Proficiency
3. Feature
4. Race
5. Spell
6. Level
7. Class
8. Subclass
9. Monster

For each model:

1. Analyze complex GraphQL relationships and data requirements.
2. Define TypeGraphQL `@ObjectType` (potentially with nested types/field resolvers) and `@Resolver`.
3. Migrate integration tests.
4. Verify complex interactions via GraphQL endpoint.
5. Deploy to production.

### 5. GraphQL Infrastructure Migration (Week 9)

1. Port custom scalars to TypeGraphQL.
   - Strategy: Adapt existing scalar logic using TypeGraphQL's `GraphQLScalarType` or implement custom `@InputType`s for filters (See Appendix C).
   - Verify behavior in GraphQL queries/mutations.
2. Finalize Redis caching integration with TypeGraphQL resolvers if necessary (e.g., using decorators or middleware).
3. Finalize Apollo Server configuration with the TypeGraphQL schema.
4. Verify all middleware (rate limiting, error tracking, CORS) works correctly with the final TypeGraphQL setup.

### 6. Final Steps (Week 10)

1. Remove any remaining old GraphQL Compose artifacts or dependencies.
2. Clean up unused code
3. Update documentation
4. Final testing pass
5. Production deployment

## Risks and Mitigations

### 1. GraphQL Schema Incompatibility

- Risk: TypeGraphQL schema differs unexpectedly from the old GraphQL Compose schema, breaking clients.
- Mitigation:
  - Aim for schema compatibility where possible.
  - Thorough integration testing using existing client query patterns.
  - Versioning the API if significant breaking changes are unavoidable (though the goal is to avoid this).

### 2. Performance

- Risk: TypeGraphQL resolvers introduce performance regressions compared to old resolvers.
- Mitigation:
  - Performance testing before deployment.
  - Leverage existing Redis cache (ensure integration).
  - Use tools like Apollo Studio or DataLoader for optimization if needed.
  - Monitor query execution times post-deployment.

### 3. Service Availability

- Risk: Migration deployment causes downtime or errors.
- Mitigation:
  - One model's GraphQL layer at a time migration strategy.
  - Immediate rollback capability: Maintain the ability to quickly revert code changes for a specific model's TypeGraphQL resolver/type if critical issues are found.
    - **Identify Commits:** Ensure migration commits are clearly identifiable (e.g., per-model resolver commits).
    - **Revert Code:** Use `git checkout <last_good_commit_hash> -- src/graphql/2014/resolvers/modelNameResolver.ts src/models/2014/ModelName.ts` (adjust paths if types/resolvers are co-located or separate) to revert the specific files.
    - **Deploy Reverted Code:** Redeploy the application with the reverted code.
  - Comprehensive integration testing before deployment.

### 4. Testing Coverage Gaps

- Risk: Integration tests don't cover all edge cases in the new TypeGraphQL resolvers.
- Mitigation:
  - Maintain separate test files
  - Keep existing test infrastructure
  - Verify coverage for each migration

### 5. Caching Issues

- Risk: Cache invalidation or integration issues with TypeGraphQL resolvers.
- Mitigation:
  - Maintain existing cache keys
  - Verify cache behavior for each model
  - Comprehensive cache integration tests

## Success Criteria

1. All GraphQL types and resolvers migrated from GraphQL Compose to TypeGraphQL.
2. All integration tests passing with existing coverage levels.
3. No regression in API functionality or performance.
4. Cleaner, potentially more consolidated GraphQL codebase using decorators.
5. Fully functional caching layer integrated with TypeGraphQL.
6. All middleware operating correctly with the TypeGraphQL API.

## Appendix A: Example Simple Model GraphQL Migration (Alignment)

This appendix demonstrates migrating the GraphQL layer for a simple model, `Alignment`, from GraphQL Compose to TypeGraphQL. It assumes the `Alignment` Typegoose model already exists.

### Old Implementation (Conceptual)

- `src/models/2014/Alignment.ts` (Existing Typegoose Model)
- `src/graphql/2014/types/AlignmentType.ts` (Old GraphQL Compose Type definition)
- `src/graphql/2014/resolvers/alignmentResolver.ts` (Old GraphQL Compose Resolver logic)

### New Implementation (TypeGraphQL - potentially augmenting model file or separate resolver)

**Option 1: Augmenting the Typegoose Model File**

```typescript
// src/models/2014/Alignment.ts
import { ObjectType, Field, ID, Resolver, Query, Arg } from 'type-graphql';
import { prop as Property, getModelForClass } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';

@ObjectType({ description: 'Represents a creature\'s moral and ethical outlook.' })
export class Alignment extends Base<string> {
  @Field(() => ID)
  get id(): string {
    return this._id.toString(); // Ensure string conversion if needed
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

  // Typegoose Model
  static get model() {
    return getModelForClass(Alignment, { schemaOptions: { collection: 'alignments' } });
  }
}

// Resolver can be in the same file or separate
@Resolver(Alignment)
export class AlignmentResolver {
  @Query(() => [Alignment], { description: "Gets all alignments." })
  async alignments(): Promise<Alignment[]> {
    // Use the Typegoose model for data access
    return Alignment.model.find().lean();
  }

  @Query(() => Alignment, { nullable: true, description: "Gets a single alignment by ID." })
  async alignment(@Arg('id', () => ID) id: string): Promise<Alignment | null> {
    // Add error handling as needed
    return Alignment.model.findById(id).lean();
  }

  // Add Mutations if needed using @Mutation decorator
}
```

**Option 2: Separate Resolver File**

```typescript
// src/graphql/2014/resolvers/AlignmentResolver.ts
import { Resolver, Query, Arg, ID } from 'type-graphql';
import { Alignment } from '../../models/2014/Alignment'; // Import the Typegoose model/ObjectType

@Resolver(Alignment)
export class AlignmentResolver {
  @Query(() => [Alignment], { description: "Gets all alignments." })
  async alignments(): Promise<Alignment[]> {
    return Alignment.model.find().lean();
  }

  @Query(() => Alignment, { nullable: true, description: "Gets a single alignment by ID." })
  async alignment(@Arg('id', () => ID) id: string): Promise<Alignment | null> {
    return Alignment.model.findById(id).lean();
  }

  // Add Mutations if needed
}

// Ensure the Alignment class in src/models/2014/Alignment.ts has @ObjectType and @Field decorators.
```

**Key Changes & Considerations:**

1.  **`@ObjectType` / `@Field`:** The Typegoose `Alignment` class is decorated with `@ObjectType` and its relevant properties with `@Field` to expose them in the GraphQL schema.
2.  **`@Resolver` / `@Query` / `@Arg`:** A new `AlignmentResolver` class is created using TypeGraphQL decorators. Methods like `alignments` and `alignment` define the GraphQL queries. `@Arg` defines query arguments.
3.  **Data Access:** The resolver methods use the existing `Alignment.model` (the Typegoose model) to fetch data from the database.
4.  **Consolidation Choice:** You can choose to put the `@Resolver` in the same file as the `@ObjectType`/Typegoose model or keep it separate (e.g., `src/graphql/2014/resolvers/`). Co-location can improve discoverability for simple models.
5.  **Dependencies:** Assumes `type-graphql`, `reflect-metadata`, and `@typegoose/typegoose` are installed and configured. `buildSchema` needs to be pointed to the resolver class(es).

## Appendix B: Example Complex Model GraphQL Migration (Monster)

This appendix outlines migrating the GraphQL layer for a complex model like `Monster`, assuming the `Monster` Typegoose model already exists with its nested structures and relationships.

**Old Implementation (Conceptual)**

*   `src/models/2014/Monster.ts` (Existing complex Typegoose Model, possibly with nested classes for actions, abilities etc.)
*   `src/graphql/2014/types/MonsterType.ts` (Old GraphQL Compose Type)
*   `src/graphql/2014/resolvers/monsterResolver.ts` (Old GraphQL Compose Resolver)

**New Implementation (TypeGraphQL - Decorating Model and Creating Resolver)**

```typescript
// src/models/2014/Monster.ts (Ensure TypeGraphQL decorators are added)
import { ObjectType, Field, ID, Float, Int } from 'type-graphql';
import { prop as Property, getModelForClass, Ref } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
// Import related models/types if they are also ObjectTypes
import { AbilityScore } from './AbilityScore';
import { Skill } from './Skill';
// ... other imports

// Ensure nested classes used in properties are also decorated with @ObjectType
@ObjectType({ description: 'An action a monster can perform' })
class MonsterAction {
  @Field()
  @Property({ required: true })
  name!: string;

  @Field()
  @Property({ required: true })
  desc!: string;

  // Other fields... ensure they have @Field if needed in GraphQL
}

@ObjectType({ description: 'A special ability of the monster' })
class SpecialAbility {
  @Field()
  @Property({ required: true })
  name!: string;

  @Field()
  @Property({ required: true })
  desc!: string;

  // Other fields... ensure they have @Field if needed in GraphQL
}


@ObjectType({ description: 'Represents a creature from the D&D SRD.' })
export class Monster extends Base<string> {
  @Field(() => ID)
  get id(): string {
    return this._id.toString();
  }

  @Field({ description: 'The name of the monster.' })
  @Property({ required: true, index: true, unique: true })
  name!: string;

  // ... Add @Field decorators to all properties exposed via GraphQL ...

  @Field({ description: 'Size category (e.g., Medium, Large).' })
  @Property({ required: true })
  size!: string; // Register as Enum if applicable

  @Field({ description: 'Creature type (e.g., Aberration, Beast).' })
  @Property({ required: true })
  type!: string; // Register as Enum if applicable

  @Field({ nullable: true, description: 'Creature subtype (e.g., Goblinoid).' })
  @Property()
  subtype?: string;

  @Field(() => Int, { description: 'Armor Class.' })
  @Property({ required: true })
  armor_class!: number;

  // ... Decorate ALL other relevant fields (hit_points, stats, speed, senses, etc.) with @Field ...

  // --- References (Example) ---
  // Ensure Proficiency is an @ObjectType if you expose it directly
  // @Field(() => Proficiency, { nullable: true })
  // @Property({ ref: () => Proficiency })
  // proficiency_bonus_ref?: Ref<Proficiency>; // Population needed in resolver

  // --- Nested Types ---
  @Field(() => [MonsterAction], { description: 'Actions the monster can take.' })
  @Property({ type: () => [MonsterAction], default: [] })
  actions?: MonsterAction[];

  @Field(() => [SpecialAbility], { description: 'Special abilities of the monster.' })
  @Property({ type: () => [SpecialAbility], default: [] })
  special_abilities?: SpecialAbility[];

  // Typegoose Model
  static get model() {
    return getModelForClass(Monster, { schemaOptions: { collection: 'monsters' } });
  }
}

// src/graphql/2014/resolvers/MonsterResolver.ts (Separate Resolver Recommended for Complex Models)
import { Resolver, Query, Arg, ID, FieldResolver, Root } from 'type-graphql';
import { Monster } from '../../models/2014/Monster'; // Import the decorated model
// Import InputTypes for filtering if used (See Appendix C)
// import { MonsterFilterInput } from '../inputs/MonsterFilterInput';
// Import other needed Types/Models
// import { Proficiency } from '../../models/2014/Proficiency';

@Resolver(Monster)
export class MonsterResolver {
  @Query(() => [Monster], { description: "Gets monsters, potentially filtered." })
  async monsters(/* @Arg('filter', () => MonsterFilterInput, { nullable: true }) filter?: MonsterFilterInput */): Promise<Monster[]> {
    const queryFilter = {}; // Build filter based on args
    // Apply population for Refs as needed
    // Example: return Monster.model.find(queryFilter).populate('proficiency_bonus_ref').lean();
    return Monster.model.find(queryFilter).lean();
  }

  @Query(() => Monster, { nullable: true, description: "Gets a single monster by ID." })
  async monster(@Arg('id', () => ID) id: string): Promise<Monster | null> {
    // Apply population for Refs as needed
    return Monster.model.findById(id).populate(/* refs needed */).lean();
  }

  // --- Field Resolvers (Example) ---
  // Use FieldResolvers for computed properties or populated refs that need logic

  // Example: If proficiency_bonus is calculated, not stored directly
  // @FieldResolver(() => Int)
  // async proficiency_bonus(@Root() monster: Monster): Promise<number> {
  //   // Logic to calculate proficiency based on challenge_rating, etc.
  //   // const cr = monster.challenge_rating; // Assuming challenge_rating has @Field
  //   // return calculateProficiencyBonus(cr);
  // }

  // Example: Resolving a populated Ref if needed
  // @FieldResolver(() => Proficiency, { nullable: true })
  // async proficiencyBonusRef(@Root() monster: Monster): Promise<Proficiency | null> {
  //   // If population wasn't done in the main query or needs extra handling
  //   if (!monster.proficiency_bonus_ref) return null;
  //   // Assumes proficiency_bonus_ref holds the ID if not populated
  //   // return Proficiency.model.findById(monster.proficiency_bonus_ref).lean();
  // }

}
```

**Key Changes & Considerations:**

1.  **`@ObjectType` / `@Field` on Model:** The existing `Monster` Typegoose class and its nested classes (`MonsterAction`, `SpecialAbility`) must be decorated with `@ObjectType` and `@Field` for all properties exposed in the GraphQL API.
2.  **Separate Resolver:** For complex models, keeping the `@Resolver` logic in a separate file (`MonsterResolver.ts`) is highly recommended for organization.
3.  **Population:** In the resolver methods (`monsters`, `monster`), use Typegoose's `.populate()` method to fetch data for referenced models (`Ref<>` properties in the Typegoose schema) if those references are exposed as GraphQL fields.
4.  **Field Resolvers (`@FieldResolver`):** Use field resolvers for:
    *   Computed fields that don't exist directly on the model (e.g., calculating `proficiency_bonus` from `challenge_rating`).
    *   Resolving relationships (`Ref` fields) if they require specific logic or weren't populated in the parent query. `@Root()` provides access to the parent `Monster` object.
5.  **Filtering/Arguments:** Define `@InputType` classes (like `MonsterFilterInput`, see Appendix C) for complex filtering arguments in queries like `monsters`. Use `@Arg` to accept these inputs in resolver methods.
6.  **Performance:** Be mindful of query complexity and N+1 problems. Use DataLoader or selective population (`populate`) to optimize data fetching, especially within field resolvers.

---

## Appendix C: Example Custom Scalar / Input Type Migration (StringFilterInput)

This appendix provides a conceptual example of how a custom filter, previously implemented as a GraphQL Compose custom scalar (like `String Filters`), can be implemented in TypeGraphQL using `@InputType`. This approach is generally preferred for structured filtering.

**Old Implementation (Conceptual)**

*   A custom GraphQL scalar type definition (e.g., `StringFilterScalar`) used directly in old resolver arguments.
*   Resolver logic manually parsed the scalar's input value.

**New Implementation (Using InputType)**

```typescript
// src/graphql/inputs/StringFilterInput.ts (Example Location)
import { InputType, Field } from 'type-graphql';
import { Length, IsOptional, IsIn } from 'class-validator'; // For input validation

@InputType({ description: 'Input for filtering strings based on various conditions.' })
export class StringFilterInput {
  @Field(() => String, { nullable: true, description: 'Matches the exact string (case-sensitive).' })
  @IsOptional()
  eq?: string;

  @Field(() => String, { nullable: true, description: 'Matches strings containing the value (case-insensitive by default in regex).' })
  @IsOptional()
  contains?: string;

  @Field(() => String, { nullable: true, description: 'Matches strings starting with the value (case-insensitive by default in regex).' })
  @IsOptional()
  startsWith?: string;

  @Field(() => String, { nullable: true, description: 'Matches strings ending with the value (case-insensitive by default in regex).' })
  @IsOptional()
  endsWith?: string;

  @Field(() => [String], { nullable: true, description: 'Matches any string exactly within the provided list.' })
  @IsOptional()
  in?: string[];

  // Example using class-validator for basic validation
  @Field(() => String, { nullable: true, description: 'Example: String must have a specific length.' })
  @IsOptional()
  @Length(5, 10) // Must be between 5 and 10 characters if provided
  fixedLengthExample?: string;

  // Add other relevant string filter conditions as needed (e.g., not equals, regex)
}


// Example Usage in a Resolver:
// src/graphql/resolvers/SomeResolver.ts
/*
import { Resolver, Query, Arg } from 'type-graphql';
import { SomeModel from '../../models/2014/SomeModel'; // Assume SomeModel Typegoose model exists and is decorated with @ObjectType/@Field
import { StringFilterInput } from '../inputs/StringFilterInput'; // Import the InputType
import { FilterQuery } from 'mongoose'; // Import Mongoose/Typegoose filter type

@Resolver(SomeModel)
export class SomeResolver {

  @Query(() => [SomeModel])
  async findSomeModels(
    @Arg('nameFilter', () => StringFilterInput, { nullable: true, description: "Filter by model name using various string conditions." }) nameFilter?: StringFilterInput
  ): Promise<SomeModel[]> {
    const queryConditions: FilterQuery<SomeModel> = {}; // Build MongoDB query filter

    if (nameFilter) {
      const nameConditions: any = {};
      if (nameFilter.eq !== undefined) nameConditions.$eq = nameFilter.eq;
      // For regex, escape special characters to avoid injection issues if needed
      if (nameFilter.contains !== undefined) nameConditions.$regex = new RegExp(nameFilter.contains.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
      if (nameFilter.startsWith !== undefined) nameConditions.$regex = new RegExp(`^${nameFilter.startsWith.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}`, 'i');
      if (nameFilter.endsWith !== undefined) nameConditions.$regex = new RegExp(`${nameFilter.endsWith.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i');
      if (nameFilter.in !== undefined) nameConditions.$in = nameFilter.in;
      // ... handle other filter conditions like fixedLengthExample if applicable ...

      // Only add name conditions if any were specified
      if (Object.keys(nameConditions).length > 0) {
        queryConditions.name = nameConditions; // Assuming the field is named 'name'
      }
    }

    console.log('Applying filter:', queryConditions);
    // Use the generated filter with Typegoose find
    return SomeModel.model.find(queryConditions).lean();
  }

  // ... other queries/mutations/resolvers for SomeModel
}
*/
```

**Key Changes & Considerations:**

1.  **`@InputType` / `@Field`:** A dedicated class (`StringFilterInput`) is created with the `@InputType` decorator. Each filter condition (`eq`, `contains`, etc.) is a property decorated with `@Field`, specifying its GraphQL type (`String`, `[String]`) and nullability.
2.  **Validation (`class-validator`):** Integrate `class-validator` decorators (`@IsOptional`, `@Length`, `@IsIn`, etc.) within the `@InputType` class. TypeGraphQL automatically runs these validators on the input arguments before your resolver code executes. Ensure `ValidationPipe` or similar is configured in your NestJS/Express setup if using `class-validator`.
3.  **Resolver Arguments:** Use the `@InputType` class as the type for arguments in your `@Query` or `@Mutation` methods (`@Arg('filterName', () => StringFilterInput)`).
4.  **Query Building:** The resolver logic inspects the properties of the received `nameFilter` object (which will be an instance of `StringFilterInput` or `undefined`). Based on which properties are set, it constructs the appropriate database query filter object (e.g., a MongoDB filter document using operators like `$eq`, `$regex`, `$in`).
5.  **Type Safety:** This approach provides better type safety and auto-completion for filter arguments compared to using generic custom scalars for complex filtering logic.
6.  **Reusability:** Define common `InputType`s like `StringFilterInput`, `NumberFilterInput`, etc., once and reuse them across multiple resolvers wherever similar filtering is needed on corresponding field types.

---
