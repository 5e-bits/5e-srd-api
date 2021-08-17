const AbilityScore = require('./abilityScoreResolver');
const Armor = require('./armorResolver');
const IEquipment = require('./iEquipmentResolver');
const Equipment = require('./equipmentResolver');
const EquipmentCategory = require('./equipmentCategoryResolver');
const Gear = require('./gearResolver');
const Skill = require('./skillResolver');
const Tool = require('./toolResolver');
const Query = require('./queryResolver');
const Vehicle = require('./vehicleResolver');
const Weapon = require('./weaponResolver');

const resolvers = {
  AbilityScore,
  Armor,
  IEquipment,
  Equipment,
  EquipmentCategory,
  Gear,
  Skill,
  Tool,
  Query,
  Vehicle,
  Weapon,
};

module.exports = resolvers;
