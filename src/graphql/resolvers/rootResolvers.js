const AbilityScore = require('./abilityScoreResolver');
const Ammunition = require('./ammunitionResolver');
const Armor = require('./armorResolver');
const IEquipment = require('./iEquipmentResolver');
const IEquipmentBase = require('./iEquipmentBaseResolver');
const EquipmentCategory = require('./equipmentCategoryResolver');
const IGear = require('./iGearResolver');
const Gear = require('./gearResolver');
const MagicItem = require('./magicItemResolver');
const Pack = require('./packResolver');
const Skill = require('./skillResolver');
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
  IGear,
  Gear,
  MagicItem,
  Pack,
  Skill,
  Tool,
  Query,
  Vehicle,
  Weapon,
};

module.exports = resolvers;
