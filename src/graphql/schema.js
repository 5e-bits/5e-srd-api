const composeMongoose = require('graphql-compose-mongoose').composeMongoose;
const schemaComposer = require('graphql-compose').schemaComposer;

const AbilityScore = require('../models/abilityScore');
const Alignment = require('../models/alignment');
const Background = require('../models/background');
const Condition = require('../models/condition');
const DamageType = require('../models/damageType');
const Equipment = require('../models/equipment');
const EquipmentCategory = require('../models/equipmentCategory');
const Feat = require('../models/feat');
const Feature = require('../models/feature');
const Language = require('../models/language');
const MagicItem = require('../models/magicItem');
const MagicSchool = require('../models/magicSchool');
const Monster = require('../models/monster');
const Race = require('../models/race');
const Rule = require('../models/rule');
const RuleSection = require('../models/ruleSection');
const Subrace = require('../models/subrace');
const Trait = require('../models/trait');
const WeaponProperty = require('../models/weaponProperty');

const customizationOptions = {};
const AbilityScoreTC = composeMongoose(AbilityScore);
const AlignmentTC = composeMongoose(Alignment);
const BackgroundTC = composeMongoose(Background);
const ClassTC = require('./TCs/classTC');
const ConditionTC = composeMongoose(Condition);
const DamageTypeTC = composeMongoose(DamageType);
const EquipmentTC = composeMongoose(Equipment);
const EquipmentCategoryTC = composeMongoose(EquipmentCategory);
const FeatTC = composeMongoose(Feat);
const FeatureTC = composeMongoose(Feature);
const LanguageTC = composeMongoose(Language);
const LevelTC = require('./TCs/levelTC');
const MagicItemTC = composeMongoose(MagicItem);
const MagicSchoolTC = composeMongoose(MagicSchool);
const MonsterTC = composeMongoose(Monster);
const ProficiencyTC = require('./TCs/proficiencyTC');
const RaceTC = composeMongoose(Race);
const RuleTC = composeMongoose(Rule);
const RuleSectionTC = composeMongoose(RuleSection);
const SpellTC = require('./TCs/spellTC');
const SubclassTC = require('./TCs/subclassTC');
const SubraceTC = composeMongoose(Subrace);
const TraitTC = composeMongoose(Trait);
const WeaponPropertyTC = composeMongoose(WeaponProperty);

schemaComposer.Query.addFields({
  abilityScore: AbilityScoreTC.mongooseResolvers.findOne(customizationOptions),
  abilityScores: AbilityScoreTC.mongooseResolvers.findMany(customizationOptions),
  alignment: AlignmentTC.mongooseResolvers.findOne(customizationOptions),
  alignments: AlignmentTC.mongooseResolvers.findMany(customizationOptions),
  background: BackgroundTC.mongooseResolvers.findOne(customizationOptions),
  backgrounds: BackgroundTC.mongooseResolvers.findMany(customizationOptions),
  condition: ConditionTC.mongooseResolvers.findOne(customizationOptions),
  conditions: ConditionTC.mongooseResolvers.findMany(customizationOptions),
  class: ClassTC.mongooseResolvers.findOne(customizationOptions),
  classes: ClassTC.mongooseResolvers.findMany(customizationOptions),
  damageType: DamageTypeTC.mongooseResolvers.findOne(customizationOptions),
  damageTypes: DamageTypeTC.mongooseResolvers.findMany(customizationOptions),
  equipment: EquipmentTC.mongooseResolvers.findOne(customizationOptions),
  equipments: EquipmentTC.mongooseResolvers.findMany(customizationOptions),
  equipmentCategory: EquipmentCategoryTC.mongooseResolvers.findOne(customizationOptions),
  equipmentCategories: EquipmentCategoryTC.mongooseResolvers.findMany(customizationOptions),
  feat: FeatTC.mongooseResolvers.findOne(customizationOptions),
  feats: FeatTC.mongooseResolvers.findMany(customizationOptions),
  feature: FeatureTC.mongooseResolvers.findOne(customizationOptions),
  features: FeatureTC.mongooseResolvers.findMany(customizationOptions),
  language: LanguageTC.mongooseResolvers.findOne(customizationOptions),
  languages: LanguageTC.mongooseResolvers.findMany(customizationOptions),
  level: LevelTC.mongooseResolvers.findOne(customizationOptions),
  levels: LevelTC.mongooseResolvers.findMany(customizationOptions),
  magicItem: MagicItemTC.mongooseResolvers.findOne(customizationOptions),
  magicItems: MagicItemTC.mongooseResolvers.findMany(customizationOptions),
  magicSchool: MagicSchoolTC.mongooseResolvers.findOne(customizationOptions),
  magicSchools: MagicSchoolTC.mongooseResolvers.findMany(customizationOptions),
  monster: MonsterTC.mongooseResolvers.findOne(customizationOptions),
  monsters: MonsterTC.mongooseResolvers.findMany(customizationOptions),
  proficiency: ProficiencyTC.mongooseResolvers.findOne(customizationOptions),
  proficiencies: ProficiencyTC.mongooseResolvers.findMany(customizationOptions),
  race: RaceTC.mongooseResolvers.findOne(customizationOptions),
  races: RaceTC.mongooseResolvers.findMany(customizationOptions),
  rule: RuleTC.mongooseResolvers.findOne(customizationOptions),
  rules: RuleTC.mongooseResolvers.findMany(customizationOptions),
  ruleSection: RuleSectionTC.mongooseResolvers.findOne(customizationOptions),
  ruleSections: RuleSectionTC.mongooseResolvers.findMany(customizationOptions),
  spell: SpellTC.mongooseResolvers.findOne(customizationOptions),
  spells: SpellTC.mongooseResolvers.findMany(customizationOptions),
  subclass: SubclassTC.mongooseResolvers.findOne(customizationOptions),
  subclasses: SubclassTC.mongooseResolvers.findMany(customizationOptions),
  subrace: SubraceTC.mongooseResolvers.findOne(customizationOptions),
  subraces: SubraceTC.mongooseResolvers.findMany(customizationOptions),
  trait: TraitTC.mongooseResolvers.findOne(customizationOptions),
  traits: TraitTC.mongooseResolvers.findMany(customizationOptions),
  weaponProperty: WeaponPropertyTC.mongooseResolvers.findOne(customizationOptions),
  weaponProperties: WeaponPropertyTC.mongooseResolvers.findMany(customizationOptions),
});

const graphqlSchema = schemaComposer.buildSchema();
module.exports = graphqlSchema;
