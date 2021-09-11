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
const IGear = require('./iGearResolver');
const Gear = require('./gearResolver');
const Level = require('./levelResolver');
const MagicItem = require('./magicItemResolver');
const MagicSchool = require('./magicShoolResolver');
const Monster = require('./monsterResolver');
const Pack = require('./packResolver');
const Proficiency = require('./proficiencyResolver');
const ProficiencyReference = require('./proficiencyReferenceResolver');
const Race = require('./raceResolver');
const Rule = require('./ruleResolver');
const Skill = require('./skillResolver');
const Spell = require('./spellResolver');
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
  IGear,
  Gear,
  Level,
  MagicItem,
  MagicSchool,
  Monster,
  Pack,
  Proficiency,
  ProficiencyReference,
  Race,
  Rule,
  Skill,
  Spell,
  Subrace,
  Tool,
  Trait,
  Query,
  Vehicle,
  Weapon,
};

module.exports = resolvers;
