const composeMongoose = require('graphql-compose-mongoose').composeMongoose;
const schemaComposer = require('graphql-compose').schemaComposer;

const AbilityScore = require('../models/abilityScore');
const Alignment = require('../models/alignment');
const Background = require('../models/background');
const Class = require('../models/class');
const Condition = require('../models/condition');
const DamageType = require('../models/damageType');
const Equipment = require('../models/equipment');
const EquipmentCategory = require('../models/equipmentCategory');
const Feature = require('../models/feature');
const Language = require('../models/language');
const Level = require('../models/level');
const MagicItem = require('../models/magicItem');
const MagicSchool = require('../models/magicSchool');
const Monster = require('../models/monster');
const Proficiency = require('../models/proficiency');
const Race = require('../models/race');
const Rule = require('../models/rule');
const RuleSection = require('../models/ruleSection');
const Spell = require('../models/spell');
const StartingEquipment = require('../models/startingEquipment');
const Subclass = require('../models/subclass');
const Subrace = require('../models/subrace');
const Trait = require('../models/trait');
const WeaponProperty = require('../models/weaponProperty');

const customizationOptions = {
  filter: {
    operators: true,
  },
};
const AbilityScoreTC = composeMongoose(AbilityScore, customizationOptions);
const AlignmentTC = composeMongoose(Alignment, customizationOptions);
const BackgroundTC = composeMongoose(Background, customizationOptions);
const ClassTC = composeMongoose(Class, customizationOptions);
const ConditionTC = composeMongoose(Condition, customizationOptions);
const DamageTypeTC = composeMongoose(DamageType, customizationOptions);
const EquipmentTC = composeMongoose(Equipment, customizationOptions);
const EquipmentCategoryTC = composeMongoose(EquipmentCategory, customizationOptions);
const FeatureTC = composeMongoose(Feature, customizationOptions);
const LanguageTC = composeMongoose(Language, customizationOptions);
const LevelTC = composeMongoose(Level, customizationOptions);
const MagicItemTC = composeMongoose(MagicItem, customizationOptions);
const MagicSchoolTC = composeMongoose(MagicSchool, customizationOptions);
const MonsterTC = composeMongoose(Monster, customizationOptions);
const ProficiencyTC = composeMongoose(Proficiency, customizationOptions);
const RaceTC = composeMongoose(Race, customizationOptions);
const RuleTC = composeMongoose(Rule, customizationOptions);
const RuleSectionTC = composeMongoose(RuleSection, customizationOptions);
const SpellTC = composeMongoose(Spell, customizationOptions);
const StartingEquipmentTC = composeMongoose(StartingEquipment, customizationOptions);
const SubclassTC = composeMongoose(Subclass, customizationOptions);
const SubraceTC = composeMongoose(Subrace, customizationOptions);
const TraitTC = composeMongoose(Trait, customizationOptions);
const WeaponPropertyTC = composeMongoose(WeaponProperty, customizationOptions);

schemaComposer.Query.addFields({
  abilityScore: AbilityScoreTC.mongooseResolvers.findOne(),
  abilityScores: AbilityScoreTC.mongooseResolvers.findMany(),
  alignment: AlignmentTC.mongooseResolvers.findOne(),
  alignments: AlignmentTC.mongooseResolvers.findMany(),
  background: BackgroundTC.mongooseResolvers.findOne(),
  backgrounds: BackgroundTC.mongooseResolvers.findMany(),
  condition: ConditionTC.mongooseResolvers.findOne(),
  conditions: ConditionTC.mongooseResolvers.findMany(),
  class: ClassTC.mongooseResolvers.findOne(),
  classes: ClassTC.mongooseResolvers.findMany(),
  damageType: DamageTypeTC.mongooseResolvers.findOne(),
  damageTypes: DamageTypeTC.mongooseResolvers.findMany(),
  equipment: EquipmentTC.mongooseResolvers.findOne(),
  equipments: EquipmentTC.mongooseResolvers.findMany(),
  equipmentCategory: EquipmentCategoryTC.mongooseResolvers.findOne(),
  equipmentCategories: EquipmentCategoryTC.mongooseResolvers.findMany(),
  feature: FeatureTC.mongooseResolvers.findOne(),
  features: FeatureTC.mongooseResolvers.findMany(),
  language: LanguageTC.mongooseResolvers.findOne(),
  languages: LanguageTC.mongooseResolvers.findMany(),
  level: LevelTC.mongooseResolvers.findOne(),
  levels: LevelTC.mongooseResolvers.findMany(),
  magicItem: MagicItemTC.mongooseResolvers.findOne(),
  magicItems: MagicItemTC.mongooseResolvers.findMany(),
  magicSchool: MagicSchoolTC.mongooseResolvers.findOne(),
  magicSchools: MagicSchoolTC.mongooseResolvers.findMany(),
  monster: MonsterTC.mongooseResolvers.findOne(),
  monsters: MonsterTC.mongooseResolvers.findMany(),
  proficiency: ProficiencyTC.mongooseResolvers.findOne(),
  proficiencies: ProficiencyTC.mongooseResolvers.findMany(),
  race: RaceTC.mongooseResolvers.findOne(),
  races: RaceTC.mongooseResolvers.findMany(),
  rule: RuleTC.mongooseResolvers.findOne(),
  rules: RuleTC.mongooseResolvers.findMany(),
  ruleSection: RuleSectionTC.mongooseResolvers.findOne(),
  ruleSections: RuleSectionTC.mongooseResolvers.findMany(),
  spell: SpellTC.mongooseResolvers.findOne(),
  spells: SpellTC.mongooseResolvers.findMany(),
  startingequipment: StartingEquipmentTC.mongooseResolvers.findOne(),
  startingequipments: StartingEquipmentTC.mongooseResolvers.findMany(),
  subclass: SubclassTC.mongooseResolvers.findOne(),
  subclasses: SubclassTC.mongooseResolvers.findMany(),
  subrace: SubraceTC.mongooseResolvers.findOne(),
  subraces: SubraceTC.mongooseResolvers.findMany(),
  trait: TraitTC.mongooseResolvers.findOne(),
  traits: TraitTC.mongooseResolvers.findMany(),
  weaponProperty: WeaponPropertyTC.mongooseResolvers.findOne(),
  weaponProperties: WeaponPropertyTC.mongooseResolvers.findMany(),
});

const graphqlSchema = schemaComposer.buildSchema();
module.exports = graphqlSchema;
