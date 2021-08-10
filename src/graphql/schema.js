const composeMongoose = require('graphql-compose-mongoose').composeMongoose;
const schemaComposer = require('graphql-compose').schemaComposer;

const AbilityScore = require('../models/abilityScore');
const Alignment = require('../models/alignment');
const Background = require('../models/background');
const Condition = require('../models/condition');
const Class = require('../models/class');
const DamageType = require('../models/damageType');
const Equipment = require('../models/equipment');
const EquipmentCategory = require('../models/equipmentCategory');
const Feat = require('../models/feat');
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
const Subclass = require('../models/subclass');
const Subrace = require('../models/subrace');
const Trait = require('../models/trait');
const WeaponProperty = require('../models/weaponProperty');

const customizationOptions = {};
const AbilityScoreTC = composeMongoose(AbilityScore);
const AlignmentTC = composeMongoose(Alignment);
const BackgroundTC = composeMongoose(Background);
const ClassTC = composeMongoose(Class);
const ConditionTC = composeMongoose(Condition);
const DamageTypeTC = composeMongoose(DamageType);
const EquipmentTC = composeMongoose(Equipment);
const EquipmentCategoryTC = composeMongoose(EquipmentCategory);
const FeatTC = composeMongoose(Feat);
const FeatureTC = composeMongoose(Feature);
const LanguageTC = composeMongoose(Language);
const LevelTC = composeMongoose(Level);
const MagicItemTC = composeMongoose(MagicItem);
const MagicSchoolTC = composeMongoose(MagicSchool);
const MonsterTC = composeMongoose(Monster);
const ProficiencyTC = composeMongoose(Proficiency);
const RaceTC = composeMongoose(Race);
const RuleTC = composeMongoose(Rule);
const RuleSectionTC = composeMongoose(RuleSection);
const SpellTC = composeMongoose(Spell);
const SubclassTC = composeMongoose(Subclass);
const SubraceTC = composeMongoose(Subrace);
const TraitTC = composeMongoose(Trait);
const WeaponPropertyTC = composeMongoose(WeaponProperty);

ClassTC.addRelation('class_levels', {
  resolver: () => LevelTC.mongooseResolvers.findMany(customizationOptions),
  prepareArgs: {
    filter: source => ({
      class: {
        index: source.index
      }
    })
  },
  projection: { index: true }
});

ClassTC.addRelation('spells', {
  resolver: () => SpellTC.mongooseResolvers.findMany(customizationOptions),
  prepareArgs: {
      filter: source => ({
          classes: [{ index: source.index }]
      })
  },
  projection: {index: true}
});

ClassTC.addRelation('proficiencies', {
  resolver: () => ProficiencyTC.mongooseResolvers.findMany(customizationOptions),
  prepareArgs: {
    filter: source => ({
      classes: [{ index: source.index }]
  })},
  projection: { index: true }
});

FeatureTC.addRelation('level', {
  resolver: () => LevelTC.mongooseResolvers.findOne(customizationOptions),
  prepareArgs: {
    filter: source => ({
      features: [{ index: source.index }]
    })
  },
  projection: { index: true }
});

FeatureTC.addRelation('class', {
  resolver: () => ClassTC.mongooseResolvers.findOne(customizationOptions),
  prepareArgs: {
    filter: source => ({
      index: source.class.index
    })
  },
  projection: { class: true }
});

FeatureTC.addRelation('subclass', {
  resolver: () => SubclassTC.mongooseResolvers.findOne(customizationOptions),
  prepareArgs: {
    filter: source => ({
      index: source.subclass.index
    })
  },
  projection: { subclass: true }
});

LevelTC.addRelation('class', {
  resolver: () => ClassTC.mongooseResolvers.findOne(customizationOptions),
  prepareArgs: {
      filter: source => ({
          index: source.class.index
      })
  },
  projection: { class: true }
});

LevelTC.addRelation('subclass', {
  resolver: () => SubclassTC.mongooseResolvers.findOne(customizationOptions),
  prepareArgs: {
      filter: source => ({
          index: source.subclass.index
      })
  },
  projection: { subclass: true }
});

LevelTC.addRelation('features', {
  resolver: () => FeatureTC.mongooseResolvers.findMany(customizationOptions),
  prepareArgs: {
    filter: source => ({
      level: source.level,
      class: { index: source.class.index }
    })
  },
  projection: { level: true, class: true }
});

SubclassTC.addRelation('class', {
  resolver: () => ClassTC.mongooseResolvers.findOne(customizationOptions),
  prepareArgs: {
      filter: source => ({
          index: source.class.index
      })
  },
  projection: { class: true }
});

SubclassTC.addRelation('subclass_levels', {
  resolver: () => LevelTC.mongooseResolvers.findMany(customizationOptions),
  prepareArgs: {
    filter: source => ({
      subclass: {
        index: source.index
      }
    }),
    projection: { index: true }
  }
});

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
