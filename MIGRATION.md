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

### Code Organization
- Main code location: `src/models/2014`
- Resolvers (if needed separately): `src/graphql/2014/resolvers`
- Tests remain in separate files
- Goal: Combine model, type, and resolver files where possible

### Dependency Management
- Update existing package.json
- Add latest compatible versions of:
  - TypeGraphQL
  - Typegoose
  - Required peer dependencies
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

## Migration Steps

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
1. AbilityScore (foundation for many other models)
2. Alignment (basic enumeration)
3. Condition (basic properties)
4. DamageType (basic properties)
5. Language (basic properties)
6. MagicSchool (basic properties)
7. RuleSection (basic documentation)
8. WeaponProperty (basic properties)
9. Collection (basic organization)
10. EquipmentCategory (basic categorization)
11. Skill (basic properties with ability score reference)

For each model:
1. Create new TypeGraphQL + Typegoose implementation
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
  - One model at a time migration
  - Immediate rollback capability
  - Comprehensive testing before deployment

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
