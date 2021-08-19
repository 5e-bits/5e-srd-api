const AbilityScore = require('./abilityScoreResolver');
const Ammunition = require('./ammunitionResolver');
const Armor = require('./armorResolver');
const IEquipment = require('./iEquipmentResolver');
const IEquipmentBase = require('./iEquipmentBaseResolver');
const EquipmentCategory = require('./equipmentCategoryResolver');
const Feat = require('./featResolver');
const IGear = require('./iGearResolver');
const Gear = require('./gearResolver');
const MagicItem = require('./magicItemResolver');
const MagicSchool = require('./magicShoolResolver');
const Pack = require('./packResolver');
const Proficiency = require('./proficiencyResolver');
const ProficiencyReference = require('./proficiencyReferenceResolver');
const Rule = require('./ruleResolver');
const Skill = require('./skillResolver');
const Spell = require('./spellResolver');
const Tool = require('./toolResolver');
const Query = require('./queryResolver');
const Vehicle = require('./vehicleResolver');
const Weapon = require('./weaponResolver');

const resolvers = {
  AbilityScore,
  Ammunition,
  Armor,
  IEquipment,
  IEquipmentBase,
  EquipmentCategory,
  Feat,
  IGear,
  Gear,
  MagicItem,
  MagicSchool,
  Pack,
  Proficiency,
  ProficiencyReference,
  Rule,
  Skill,
  Spell,
  Tool,
  Query,
  Vehicle,
  Weapon,
};

module.exports = resolvers;
