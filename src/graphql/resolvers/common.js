const EquipmentCategory = require('../../models/equipmentCategory');

const equipmentBaseFieldResolvers = {
  equipment_category: async equipment =>
    await EquipmentCategory.findOne({ index: equipment.equipment_category.index }).lean(),
};

const equipmentFieldResolvers = {
  ...equipmentBaseFieldResolvers,
  cost: equipment => ({ ...equipment.cost, unit: equipment.cost.unit.toUpperCase() }),
};

const gearFieldResolvers = {
  ...equipmentFieldResolvers,
  gear_category: async gear =>
    await EquipmentCategory.findOne({ index: gear.gear_category.index }).lean(),
};

const resolveGearType = gear => {
  if (gear.contents) return 'Pack';
  if (gear.quantity) return 'Ammunition';
  if (gear.gear_category) return 'Gear';
  return null;
};

const resolveEquipmentType = equipment => {
  if (equipment.tool_category) return 'Tool';
  if (equipment.gear_category) return resolveGearType(equipment);
  if (equipment.armor_class) return 'Armor';
  if (equipment.weapon_category) return 'Weapon';
  if (equipment.vehicle_category) return 'Vehicle';
  return null;
};

const levelObjectToArray = (obj, fieldName) =>
  Object.entries(obj).map(([level, value]) => ({ level, [fieldName]: value }));

module.exports = {
  equipmentBaseFieldResolvers,
  equipmentFieldResolvers,
  gearFieldResolvers,
  resolveGearType,
  resolveEquipmentType,
  levelObjectToArray,
};
