const AbilityScore = require('./abilityScoreResolver');
const Ammunition = require('./ammunitionResolver');
const Armor = require('./armorResolver');
const Background = require('./backgroundResolver');
const Class = require('./classResolver');
const ClassSpecific = require('./classSpecificResolver');
const IEquipment = require('./iEquipmentResolver');
const IEquipmentBase = require('./iEquipmentBaseResolver');
const EquipmentCategory = require('./equipmentCategoryResolver');
const Feat = require('./featResolver');
const Feature = require('./featureResolver');
const FloatFilter = require('./scalars/floatFilterResolver');
const IGear = require('./iGearResolver');
const Gear = require('./gearResolver');
const IntFilter = require('./scalars/intFilterResolver');
const Language = require('./languageResolver');
const Level = require('./levelResolver');
const MagicItem = require('./magicItemResolver');
const MagicSchool = require('./magicShoolResolver');
const Monster = require('./monsterResolver');
const MonsterSubtypeFilter = require('./scalars/monsterSubtypeFilterResolver');
const MonsterTypeFilter = require('./scalars/monsterTypeFilterResolver');
const Pack = require('./packResolver');
const Proficiency = require('./proficiencyResolver');
const ProficiencyRace = require('./proficiencyRaceResolver');
const ProficiencyReference = require('./proficiencyReferenceResolver');
const Race = require('./raceResolver');
const Rule = require('./ruleResolver');
const SizeFilter = require('./scalars/sizeFilterResolver');
const Skill = require('./skillResolver');
const Spell = require('./spellResolver');
const SpellPrerequisite = require('./spellPrerequisiteResolver');
const StringFilter = require('./scalars/stringFilterResolver');
const Subclass = require('./subclassResolver');
const SubclassSpecific = require('./subclassSpecificResolver');
const Subrace = require('./subraceResolver');
const Tool = require('./toolResolver');
const Trait = require('./traitResolver');
const Query = require('./queryResolver');
const Vehicle = require('./vehicleResolver');
const Weapon = require('./weaponResolver');

const resolvers = {
  AbilityScore,
  Ammunition,
  Armor,
  Background,
  Class,
  ClassSpecific,
  IEquipment,
  IEquipmentBase,
  EquipmentCategory,
  Feat,
  Feature,
  FloatFilter,
  IGear,
  Gear,
  IntFilter,
  Language,
  Level,
  MagicItem,
  MagicSchool,
  Monster,
  MonsterSubtypeFilter,
  MonsterTypeFilter,
  Pack,
  Proficiency,
  ProficiencyRace,
  ProficiencyReference,
  Race,
  Rule,
  SizeFilter,
  Skill,
  Spell,
  SpellPrerequisite,
  StringFilter,
  Subclass,
  SubclassSpecific,
  Subrace,
  Tool,
  Trait,
  Query,
  Vehicle,
  Weapon,
};

module.exports = resolvers;
