const IEquipment = {
  __resolveType(equipment) {
    if (equipment.tool_category) return 'Tool';
    if (equipment.gear_category) return 'Gear';
    if (equipment.armor_class) return 'Armor';
    if (equipment.weapon_category) return 'Weapon';
    if (equipment.vehicle_category) return 'Vehicle';
    if (equipment.name) return 'Equipment';
    return null;
  },
};

module.exports = IEquipment;
