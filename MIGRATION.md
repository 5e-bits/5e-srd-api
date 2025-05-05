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
// - Collection (basic organization) <- Removed as not part of GraphQL schema
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

- Typegoose Models remain in: `src/models/2014`
- New TypeGraphQL Resolvers, InputTypes, and other GraphQL-specific files will be placed in a temporary directory: `src/graphql/2014rewrite`
  - Resolvers: `src/graphql/2014rewrite/resolvers/`
  - Inputs: `src/graphql/2014rewrite/inputs/`
  - Shared Enums/Interfaces (GraphQL specific): `src/graphql/2014rewrite/common/`
  - **Convention:** Resolver filenames should use lowerCamelCase (e.g., `myResolver.ts`).
- Tests remain in separate files.
- Goal: Define GraphQL schema using TypeGraphQL decorators within the `2014rewrite` structure during migration.

### Dependency Management

- Update existing package.json
- Add latest compatible versions of:
  - `type-graphql`: 2.0.0-rc.2
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

### Pre-Migration Cleanup

1. Remove deprecated GraphQL Compose dependencies
   - Ensure `graphql-compose` and related packages are removed.
   - Confirm the setup relies on `@apollo/server`, `@graphql-tools/schema`, and custom resolvers.

### 1. Initial Setup (Week 1)

1. Add TypeGraphQL dependencies (`type-graphql`, `reflect-metadata`, `class-validator`).
2. Configure TypeGraphQL with Express/Apollo Server.
   - Set up `buildSchema` from `type-graphql`.
   - Integrate the generated schema with Apollo Server.
   - **Explicitly configure `buildSchema` (or equivalent) to find resolvers within `src/graphql/2014rewrite/resolvers/**/*.ts`.**
3. Create a template for migrating a resolver/type.
4. Configure middleware integration with the new TypeGraphQL setup:
   - Ensure Apollo Server cache control, depth limiting, rate limiting, error tracking, etc., work with the TypeGraphQL schema.
5. Identify and place any shared GraphQL-specific enums or input types (e.g., `OrderByDirection`) into `src/graphql/2014rewrite/common/` early to promote reusability.

### 2. Pass 1: Basic Field Migration (Weeks 2-4)

Migrate the GraphQL layer for all models, focusing *only* on simple scalar fields and basic nested objects (like `MonsterAction` within `Monster`). **Skip `Choice` fields and fields requiring resolution via API references for now.**

Models to migrate (in approximate order of increasing complexity):

1.  - [x] Alignment
2.  - [x] Condition
3.  - [x] DamageType
4.  - [x] Language
5.  - [x] MagicSchool
6.  - [x] RuleSection
7.  - [x] WeaponProperty
8.  - [x] EquipmentCategory *(Migrate only basic fields like `index`, `name`. Skip the `equipment` field)*
9.  - [x] AbilityScore
10. - [x] Skill *(Skip `ability_score` reference field)*
11. - [x] Background *(Skip references, choices)*
12. - [x] Feat *(Skip prerequisites, choices)*
13. - [x] Rule *(Skip subsections)*
14. - [x] Trait *(Skip races, subraces)*
15. - [x] MagicItem *(Skip `equipment_category` reference)*
16. - [ ] Subrace *(Skip `race`, `ability_bonuses`, `racial_traits` references)*
17. - [ ] Equipment *(Skip `equipment_category`, `gear_category`, `cost`, etc. if complex types)*
18. - [ ] Proficiency *(Skip references like `classes`, `races`)*
19. - [ ] Feature *(Skip `class`, `subclass`, prerequisites, choices)*
20. - [ ] Race *(Skip `ability_bonuses`, `proficiencies`, `languages`, `traits`, `subraces`)*
21. - [ ] Spell *(Skip `classes`, `subclasses`, `damage`, `dc` if complex)*
22. - [ ] Level *(Skip `class`, `subclass`, `features`, `spellcasting`)*
23. - [ ] Class *(Skip `proficiencies`, `saving_throws`, `spellcasting`, `subclasses`, starting equipment choices)*
24. - [ ] Subclass *(Skip `class`, `features`, `spells`)*
25. - [ ] Monster *(Skip complex nested structures needing resolution like specific ability scores, skills, proficiencies, actions needing lookups, special abilities needing lookups)*

For each model in Pass 1:

1. Define the TypeGraphQL `@ObjectType` decorators on the existing Typegoose class.
   - Add `@Field()` to basic properties (`name`, `desc`, `index`, etc.).
   - Decorate simple nested structures (like `MonsterAction` arrays) if they don't require external lookups.
   - **Do not** add `@Field()` to the `_id` property.
   - **Do not** add `@Field()` to `url` or other unused properties.
   - **Do not** add `@Field()` for fields representing choices or references to other models yet.
   - Add `// TODO: Pass 2 - Implement reference resolver` comment next to reference fields that are skipped.
   - Add `// TODO: Pass 3 - Implement choice resolver` comment next to choice fields that are skipped.
   - Ensure only a `default` export is used for the Typegoose model (`const ModelName = ...; export default ModelName;`).
2. Create the TypeGraphQL `@Resolver` class (e.g., in `src/graphql/2014rewrite/resolvers/`) with basic `@Query` methods (e.g., `queryAll`, `queryByIndex`).
   - Implement basic filtering and sorting if applicable for the queried fields.
   - Use the `lowerCamelCase` naming convention (e.g., `alignmentResolver.ts`).
3. Implement the TypeGraphQL replacements within the `src/graphql/2014rewrite` directory.
4. Update/migrate existing integration tests targeting the GraphQL API for the *basic fields* of this model, ensuring they point to the schema generated from the new resolvers.
5. Verify basic GraphQL functionality through testing.
6. Deploy to production (optional per-model deployment).

### 3. Pass 1 Cleanup: Refactor Common Arguments (Week 4 - Part 2)

1. Identify common query arguments introduced in Pass 1 resolvers (e.g., `name` filter, `order_direction` sorting).
2. Create a reusable base `@ArgsType` class (e.g., `BaseNameArgs` in `src/graphql/2014rewrite/common/args.ts`).
3. Refactor the resolvers modified in Pass 1 to use the new base `ArgsType`, removing redundant argument definitions.

### 4. Pass 2: API Reference Field Migration (Weeks 5-7)

Implement the `@FieldResolver` logic or adjust main query population for fields that reference other models (e.g., `Skill.ability_score`, `Trait.races`, `EquipmentCategory.equipment`, `Monster` references).

Iterate through the models again, focusing on connecting them:

1. Add `@Field()` decorators to the reference fields skipped in Pass 1.
2. Implement `@FieldResolver` in the appropriate resolver (or use `.populate()` in the main queries) to resolve these references.
   - Example: In `SkillResolver`, add a field resolver for the `ability_score` field to fetch the related `AbilityScore` object.
   - Example: In `EquipmentCategoryResolver`, add a field resolver for `equipment` (ensure it returns the correct Interface/Union type for `Equipment`/`MagicItem`).
3. Update integration tests to verify the resolved reference fields.
4. Verify functionality via GraphQL endpoint.
5. Deploy to production.

### 5. Pass 3: Choice Field Migration (Weeks 8-9)

Implement the logic for resolving `Choice` fields across relevant models (e.g., `Background`, `Class`, `Race`, `Feature`).

1. Add `@Field()` decorators to the `Choice` fields skipped previously.
2. Define necessary supporting `@ObjectType`s or `@InputType`s for choice structures if needed.
3. Implement `@FieldResolver`s (or logic within main queries) to handle the resolution of choices, often involving complex lookups or data structuring based on the choice definition.
4. Update integration tests to specifically cover the choice resolution logic.
5. Verify functionality via GraphQL endpoint.
6. Deploy to production.

### 6. GraphQL Infrastructure Migration (Week 10)

1. Port custom scalars to TypeGraphQL.
   - Strategy: Adapt existing scalar logic using TypeGraphQL's `GraphQLScalarType` or implement custom `@InputType`s for filters (See Appendix C).
   - Verify behavior in GraphQL queries/mutations.
2. Finalize Redis caching integration with TypeGraphQL resolvers if necessary (e.g., using decorators or middleware).
3. Finalize Apollo Server configuration with the TypeGraphQL schema.
4. Verify all middleware (rate limiting, error tracking, CORS) works correctly with the final TypeGraphQL setup.

### 7. Final Steps (Week 11)

1. Remove any remaining old GraphQL Compose artifacts or dependencies.
2. Delete the old `src/graphql/2014` directory.
3. Decide on the final location for the new GraphQL files:
    a. Rename `src/graphql/2014rewrite` to `src/graphql/2014` OR
    b. Move files from `src/graphql/2014rewrite` to other locations (e.g., co-locate resolvers/types with models in `src/models/2014`).
    c. Update all imports and configurations (`buildSchema` path) accordingly.
    d. *(Consider team preference/codebase style: keep GraphQL separate or co-locate for proximity?)*
4. Clean up unused code.
5. Update documentation to reflect the final TypeGraphQL implementation and file structure.
6. Final testing pass covering all fields (basic, references, choices).
7. Production deployment.

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
    - **Revert Code:** Use `git checkout <last_good_commit_hash> -- src/graphql/2014rewrite/resolvers/modelNameResolver.ts src/models/2014/ModelName.ts` (adjust paths if types/resolvers are co-located or separate) to revert the specific model and resolver files. This removes the problematic model's types and queries from the *currently building TypeGraphQL schema* upon redeployment, allowing other migrated models to continue functioning. It does **not** revert the entire application back to the old `graphql-compose` schema.
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
// src/models/2014/alignment.ts // Lowercase convention
import { ObjectType, Field, Resolver, Query, Arg, ID } from 'type-graphql'; // Include Resolver decorators if colocating
import { prop as Property, getModelForClass } from '@typegoose/typegoose';
// Remove Base import if not extending

@ObjectType({ description: "Represents a creature's moral and ethical outlook." })
// Add any necessary Typegoose options like @srdModelOptions if applicable
export class Alignment {
  // _id is handled by Typegoose; no @Field needed as API doesn't expose GraphQL ID.

  @Field(() => String, { description: 'A brief description of the alignment.' })
  @Property({ required: true, index: true, type: () => String })
  desc!: string;

  @Field(() => String, { description: 'A shortened representation of the alignment (e.g., LG, CE).' })
  @Property({ required: true, index: true, type: () => String })
  abbreviation!: string;

  @Field(() => String, { description: 'The unique identifier for this alignment (e.g., lawful-good).' })
  @Property({ required: true, index: true, type: () => String })
  index!: string;

  @Field(() => String, { description: 'The name of the alignment (e.g., Lawful Good, Chaotic Evil).' })
  @Property({ required: true, index: true, type: () => String })
  name!: string;

  // url property exists but has no @Field decorator - not exposed in API currently
  @Property({ required: true, index: true, type: () => String })
  url!: string;

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @Property({ required: true, index: true, type: () => String })
  updated_at!: string;

}

// Typegoose Model (Default export only)
const AlignmentModel = getModelForClass(Alignment, { schemaOptions: { collection: 'alignments' } });
export default AlignmentModel;

// Resolver (if colocating)
/*
@Resolver(Alignment)
export class AlignmentResolver {
  // Add ArgsType definition here if colocating

  @Query(() => [Alignment], { description: "Gets all alignments, optionally filtered and sorted." })
  async alignments(@Args() args: AlignmentArgs): Promise<Alignment[]> {
    // Add logic to handle args.name and args.order_direction
    return AlignmentModel.find({ /* filter */ }).sort({ /* sort */ }).lean();
  }

  // Query by index if ID is not used
  @Query(() => Alignment, { nullable: true, description: "Gets a single alignment by index." })
  async alignment(@Arg('index', () => String) index: string): Promise<Alignment | null> {
    return AlignmentModel.findOne({ index }).lean();
  }
}
*/
```

**Option 2: Separate Resolver File (Recommended Approach - Placed in Rewrite Directory)**

```typescript
// src/graphql/2014rewrite/resolvers/alignmentResolver.ts // Updated path and name
import { Resolver, Query, Arg, Args, ArgsType, Field } from 'type-graphql'; // Updated imports
import { Alignment } from '@/models/2014/alignment'; // Import the Typegoose model/ObjectType
import AlignmentModel from '@/models/2014/alignment'; // Import the default export for data access
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'; // Updated path

// Define ArgsType for alignments query
@ArgsType()
class AlignmentArgs {
  @Field(() => String, { nullable: true, description: 'Filter by alignment name (case-insensitive, partial match)' })
  @IsOptional()
  @IsString()
  name?: string;

  @Field(() => OrderByDirection, { nullable: true, defaultValue: OrderByDirection.ASC, description: 'Field to sort by (default: name ASC)' })
  @IsOptional()
  @IsEnum(OrderByDirection)
  order_direction?: OrderByDirection;

  // Add other args like skip/limit if needed later
}

@Resolver(Alignment)
export class AlignmentResolver {
  @Query(() => [Alignment], { description: "Gets all alignments, optionally filtered and sorted." })
  async alignments(@Args(() => AlignmentArgs) { name, order_direction }: AlignmentArgs): Promise<Alignment[]> {
    const query = AlignmentModel.find();

    // Apply filtering
    if (name) {
      query.where({ name: { $regex: new RegExp(name, 'i') } });
    }

    // Apply sorting
    const sortOrder = order_direction === OrderByDirection.DESC ? -1 : 1;
    query.sort({ name: sortOrder });

    return query.lean();
  }

  // Query by index if ID is not used in the API
  @Query(() => Alignment, { nullable: true, description: "Gets a single alignment by index." })
  async alignment(@Arg('index', () => String) index: string): Promise<Alignment | null> {
    return AlignmentModel.findOne({ index }).lean();
  }
}

// Ensure the Alignment class in src/models/2014/alignment.ts has @ObjectType and @Field decorators as shown in Option 1.
```

**Key Changes & Considerations:**

1.  **`@ObjectType` / `@Field`:** Decorate the Typegoose class and relevant properties (`index`, `name`, `desc`, etc.). **Do not** add `@Field` for `_id` or properties not currently needed in the API (like `url`). Ensure explicit type functions (e.g., `() => String`) are used for all `@Field`, `@Arg`, and `@Args` decorators to prevent type inference issues.
2.  **`_id` Field:** The `_id` property does not need to be explicitly defined in the Typegoose class.
3.  **Model Export:** Use only a default export for the Typegoose model (`const ModelName = ...; export default ModelName;`).
4.  **Resolver Arguments:** Use the `@InputType` class as the type for arguments in your `@Query` methods (`@Arg('filterName', () => StringFilterInput)`). Ensure explicit types are used for `@Args` as well.
5.  **Mutations:** This migration assumes a read-only API; no `@Mutation` decorators are needed.
6.  **Shared Enums/Args:** Common enums (like `OrderByDirection`) or argument classes should be defined in shared files (e.g., `src/graphql/2014rewrite/common/`) and imported into resolvers to avoid duplication and registration errors.
7.  **Dependencies:** Assumes `type-graphql`, `reflect-metadata`, and `@typegoose/typegoose` are installed and configured. `buildSchema` needs to be pointed to the resolver class(es).
8.  **Naming Convention:** Resolver files should follow `lowerCamelCase` (e.g., `alignmentResolver.ts`).
9.  **File Location:** New GraphQL files reside in `src/graphql/2014rewrite/...` during migration.

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
export class Monster /* removed extends Base<string> if not used */ {
  // No _id definition needed here
  // No @Field for _id as per decision

  @Field({ description: 'The unique index for the monster.' })
  @Property({ required: true, index: true, unique: true })
  index!: string; // Ensure index is exposed

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

  // Typegoose Model (Default export only)
  // static get model() { ... } // remove static getter if not used
}

const MonsterModel = getModelForClass(Monster, { schemaOptions: { collection: 'monsters' } });
export default MonsterModel;

// src/graphql/2014rewrite/resolvers/monsterResolver.ts // Updated path and name
import { Resolver, Query, Arg, ID, FieldResolver, Root } from 'type-graphql';
import { Monster } from '@/models/2014/monster'; // Import the decorated model (path might need ../../models depending on exact structure)
import MonsterModel from '@/models/2014/monster'; // Import default export for data access (path might need ../../models)
// Adjust paths for other imports like FilterInputs from 2014rewrite/inputs
// ... other imports

@Resolver(Monster)
export class MonsterResolver {
  @Query(() => [Monster], { description: "Gets monsters, potentially filtered." })
  async monsters(/* @Arg('filter', () => MonsterFilterInput, { nullable: true }) filter?: MonsterFilterInput */): Promise<Monster[]> {
    const queryFilter = {}; // Build filter based on args
    // Apply population for Refs as needed
    // Example: return Monster.model.find(queryFilter).populate('proficiency_bonus_ref').lean();
    return MonsterModel.find(queryFilter).lean(); // Corrected: Use MonsterModel
  }

  @Query(() => Monster, { nullable: true, description: "Gets a single monster by ID." })
  async monster(@Arg('id', () => ID) id: string): Promise<Monster | null> {
    // Apply population for Refs as needed
    return MonsterModel.findById(id).populate(/* refs needed */).lean(); // Corrected: Use MonsterModel
  }

  // Query by index
  @Query(() => Monster, { nullable: true, description: "Gets a single monster by index." })
  async monsterByIndex(@Arg('index', () => String) index: string): Promise<Monster | null> {
    // Apply population for Refs as needed
    return MonsterModel.findOne({ index }).populate(/* refs needed */).lean();
  }

  // Remove or comment out query by ID if not exposed in API
  /*
  @Query(() => Monster, { nullable: true, description: "Gets a single monster by ID." })
  async monsterById(@Arg('id', () => ID) id: string): Promise<Monster | null> {
    // Apply population for Refs as needed
    return MonsterModel.findById(id).populate(/* refs needed *).lean();
  }
  */

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

1.  **`@ObjectType` / `@Field` on Model:** Decorate the existing `Monster` Typegoose class, its nested classes, and all properties exposed in the GraphQL API (including `index`). Do **not** add `@Field` for `_id` or unused fields like `url`.
2.  **`_id` Field:** No need to define `_id` in the class.
3.  **Model Export:** Use only a default export for the Typegoose `MonsterModel`.
4.  **Separate Resolver:** Highly recommended for complex models.
5.  **Population:** In the resolver methods (`monsters`, `monster`), use Typegoose's `.populate()` method to fetch data for referenced models (`Ref<>` properties in the Typegoose schema) if those references are exposed as GraphQL fields.
6.  **Field Resolvers (`@FieldResolver`):** Use field resolvers for:
    *   Computed fields that don't exist directly on the model (e.g., calculating `proficiency_bonus` from `challenge_rating`).
    *   Resolving relationships (`Ref` fields) if they require specific logic or weren't populated in the parent query. `@Root()` provides access to the parent `Monster` object.
7.  **Mutations:** No mutations are needed for this read-only API.
8.  **Filtering/Arguments:** Define `@InputType` classes (like `MonsterFilterInput`, see Appendix C) for complex filtering arguments in queries like `monsters`. Use `@Arg` to accept these inputs in resolver methods.
9.  **Performance:** Be mindful of query complexity and N+1 problems. Use DataLoader or selective population (`populate`) to optimize data fetching, especially within field resolvers.

---

## Appendix C: Example Custom Scalar / Input Type Migration (StringFilterInput)

This appendix provides a conceptual example of how a custom filter, previously implemented as a GraphQL Compose custom scalar (like `String Filters`), can be implemented in TypeGraphQL using `@InputType`. This approach is generally preferred for structured filtering.

**Old Implementation (Conceptual)**

*   A custom GraphQL scalar type definition (e.g., `StringFilterScalar`) used directly in old resolver arguments.
*   Resolver logic manually parsed the scalar's input value.

**New Implementation (Using InputType)**

```typescript
// src/graphql/2014rewrite/inputs/StringFilterInput.ts (Example Location)
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
// src/graphql/2014rewrite/resolvers/someResolver.ts // Updated path and name
/*
import { Resolver, Query, Arg } from 'type-graphql';
import { SomeModel } from '../../models/2014/SomeModel'; // Assume SomeModel Typegoose model exists and is decorated with @ObjectType/@Field
import { StringFilterInput } from '../inputs/StringFilterInput'; // Import the InputType (relative path within 2014rewrite)
import { FilterQuery } from 'mongoose'; // Import FilterQuery if using mongoose
import { getModelForClass } from '@typegoose/typegoose'; // Import if needed

@Resolver(SomeModel)
export class SomeResolver {
// ... existing code ...
```

**Key Changes & Considerations:**

1.  **`@InputType` / `@Field`:** A dedicated class (`StringFilterInput`) is created with the `@InputType` decorator. Each filter condition (`eq`, `contains`, etc.) is a property decorated with `@Field`, specifying its GraphQL type (`String`, `[String]`) and nullability.
2 **Validation (`class-validator`):** Integrate `class-validator` decorators (`@IsOptional`, `@Length`, `@IsIn`, etc.) within the `@InputType` class. TypeGraphQL automatically runs these validators on the input arguments before your resolver code executes. Ensure `ValidationPipe` or similar is configured in your NestJS/Express setup if using `class-validator`.
3.  **Resolver Arguments:** Use the `@InputType` class as the type for arguments in your `@Query` methods (`@Arg('filterName', () => StringFilterInput)`).
4.  **Query Building:** The resolver logic inspects the properties of the received `nameFilter` object (which will be an instance of `StringFilterInput` or `undefined`). Based on which properties are set, it constructs the appropriate database query filter object (e.g., a MongoDB filter document using operators like `$eq`, `$regex`, `$in`).
5.  **Type Safety:** This approach provides better type safety and auto-completion for filter arguments compared to using generic custom scalars for complex filtering logic.
6.  **Reusability:** Define common `InputType`s like `StringFilterInput`, `NumberFilterInput`, etc., once and reuse them across multiple resolvers wherever similar filtering is needed on corresponding field types.

---
