const { merge } = require('lodash');

// TODO: If we convert this to import style, we can combine abunch of these lines.
const AbilityScore = require('./abilityScore').typeDef;
const Class = require('./class').typeDef;
const Condition = require('./condition').typeDef;
const DamageType = require('./damageType').typeDef;
const Equipment = require('./equipment').typeDef;
const EquipmentCategory = require('./equipmentCategory').typeDef;
const Feature = require('./feature').typeDef;
const Language = require('./language').typeDef;
const Level = require('./level').typeDef;
const MagicItem = require('./magicItem').typeDef;
const MagicSchool = require('./magicSchool').typeDef;
const Monster = require('./monster').typeDef;
const Proficiency = require('./proficiency').typeDef;
const Race = require('./race').typeDef;
const Rule = require('./rule').typeDef;
const RuleSection = require('./ruleSection').typeDef;
const Skill = require('./skill').typeDef;
const Spell = require('./spell').typeDef;
const StartingEquipment = require('./startingEquipment').typeDef;
const Subclass = require('./subclass').typeDef;
const Subrace = require('./subrace').typeDef;
const Trait = require('./trait').typeDef;
const WeaponProperty = require('./weaponProperty').typeDef;

const abilityScoreResolvers = require('./abilityScore').resolvers;
const classResolvers = require('./class').resolvers;
const conditionResolvers = require('./condition').resolvers;
const damageTypeResolvers = require('./damageType').resolvers;
const equipmentResolvers = require('./equipment').resolvers;
const equipmentCategoryResolvers = require('./equipmentCategory').resolvers;
const featureResolvers = require('./feature').resolvers;
const languageResolvers = require('./language').resolvers;
const levelResolvers = require('./level').resolvers;
const magicItemResolvers = require('./magicItem').resolvers;
const magicSchoolResolvers = require('./magicSchool').resolvers;
const monsterResolvers = require('./monster').resolvers;
const proficiencyResolvers = require('./proficiency').resolvers;
const raceResolvers = require('./race').resolvers;
const ruleResolvers = require('./rule').resolvers;
const ruleSectionResolvers = require('./ruleSection').resolvers;
const skillResolvers = require('./skill').resolvers;
const spellResolvers = require('./spell').resolvers;
const startingEquipmentResolvers = require('./startingEquipment').resolvers;
const subclassResolvers = require('./subclass').resolvers;
const subraceResolvers = require('./subrace').resolvers;
const traitResolvers = require('./trait').resolvers;
const weaponPropertyResolvers = require('./weaponProperty').resolvers;

const Query = `
type Query {
  abilityScore(query: AbilityScoreQueryInput): AbilityScore
  abilityScores(query: AbilityScoreQueryInput, sortBy: AbilityScoreSortByInput): [AbilityScore]!
  class(query: ClassQueryInput): Class
  classes(query: ClassQueryInput, sortBy: ClassSortByInput): [Class]!
  condition(query: ConditionQueryInput): Condition
  conditions(query: ConditionQueryInput, sortBy: ConditionSortByInput): [Condition]!
  damageType(query: DamageTypeQueryInput): DamageType
  damageTypes(query: DamageTypeQueryInput, sortBy: DamageTypeSortByInput): [DamageType]!
  equipment(query: EquipmentQueryInput): Equipment
  equipmentCategories(query: EquipmentCategoryQueryInput, sortBy: EquipmentCategorySortByInput): [EquipmentCategory]!
  equipmentCategory(query: EquipmentCategoryQueryInput): EquipmentCategory
  equipments(query: EquipmentQueryInput, sortBy: EquipmentSortByInput): [Equipment]!
  feature(query: FeatureQueryInput): Feature
  features(sortBy: FeatureSortByInput, query: FeatureQueryInput, limit: Int = 100): [Feature]!
  language(query: LanguageQueryInput): Language
  languages(query: LanguageQueryInput, sortBy: LanguageSortByInput): [Language]!
  level(query: LevelQueryInput): Level
  levels(query: LevelQueryInput, sortBy: LevelSortByInput): [Level]!
  magicItem(query: MagicItemQueryInput): MagicItem
  magicItems(query: MagicItemQueryInput, sortBy: MagicItemSortByInput): [MagicItem]!
  magicSchool(query: MagicSchoolQueryInput): MagicSchool
  magicSchools(query: MagicSchoolQueryInput, sortBy: MagicSchoolSortByInput): [MagicSchool]!
  monster(query: MonsterQueryInput): Monster
  monsters(query: MonsterQueryInput, sortBy: MonsterSortByInput): [Monster]!
  proficiencies(query: ProficiencyQueryInput, sortBy: ProficiencySortByInput): [Proficiency]!
  proficiency(query: ProficiencyQueryInput): Proficiency
  rule(query: RuleQueryInput): Rule
  ruleSection(query: RuleSectionQueryInput): RuleSection
  ruleSections(query: RuleSectionQueryInput, sortBy: RuleSectionSortByInput): [RuleSection]!
  rules(query: RuleQueryInput, sortBy: RuleSortByInput): [Rule]!
  skill(query: SkillQueryInput): Skill
  skills(sortBy: SkillSortByInput, query: SkillQueryInput): [Skill]!
  spell(query: SpellQueryInput): Spell
  spells(query: SpellQueryInput, sortBy: SpellSortByInput): [Spell]!
  startingequipment(query: StartingequipmentQueryInput): Startingequipment
  startingequipments(sortBy: StartingequipmentSortByInput, query: StartingequipmentQueryInput): [Startingequipment]!
  subclass(query: SubclassQueryInput): Subclass
  subclasses(sortBy: SubclassSortByInput, query: SubclassQueryInput): [Subclass]!
  subrace(query: SubraceQueryInput): Subrace
  subraces(sortBy: SubraceSortByInput, query: SubraceQueryInput): [Subrace]!
  trait(query: TraitQueryInput): Trait
  traits(query: TraitQueryInput, sortBy: TraitSortByInput): [Trait]!
  weaponProperties(query: WeaponPropertyQueryInput, sortBy: WeaponPropertySortByInput): [WeaponProperty]!
  weaponProperty(query: WeaponPropertyQueryInput): WeaponProperty
}
`;

module.exports = {
  typeDefs: [
    AbilityScore,
    Class,
    Condition,
    DamageType,
    Equipment,
    EquipmentCategory,
    Feature,
    Language,
    Level,
    MagicItem,
    MagicSchool,
    Monster,
    Proficiency,
    Race,
    Rule,
    RuleSection,
    Skill,
    Spell,
    StartingEquipment,
    Subclass,
    Subrace,
    Trait,
    WeaponProperty,
    Query
  ],
  resolvers: merge(
    abilityScoreResolvers,
    classResolvers,
    conditionResolvers,
    damageTypeResolvers,
    equipmentResolvers,
    equipmentCategoryResolvers,
    featureResolvers,
    languageResolvers,
    levelResolvers,
    magicItemResolvers,
    magicSchoolResolvers,
    monsterResolvers,
    proficiencyResolvers,
    raceResolvers,
    ruleResolvers,
    ruleSectionResolvers,
    skillResolvers,
    spellResolvers,
    startingEquipmentResolvers,
    subclassResolvers,
    subraceResolvers,
    traitResolvers,
    weaponPropertyResolvers
  )
};
