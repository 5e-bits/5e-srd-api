const EquipmentCategory = require('../../models/equipmentCategory');
const Spell = require('../../models/spell');

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

const resolveSpellOrderBy = value =>
  value === 'AREA_OF_EFFECT_SIZE' ? 'area_of_effect.size' : value.toLowerCase();

const resolveSpells = async (args, baseFilters) => {
  const filters = [...baseFilters];
  if (args.school) {
    const filter = { 'school.index': { $in: args.school } };
    filters.push(filter);
  }

  if (args.level) {
    filters.push(resolveNumberFilter(args.level, 'level'));
  }

  if (args.class) {
    const filter = { classes: { $elemMatch: { index: { $in: args.class } } } };
    filters.push(filter);
  }

  if (args.subclass) {
    const filter = { subclasses: { $elemMatch: { index: { $in: args.subclass } } } };
    filters.push(filter);
  }

  if (args.concentration !== undefined) {
    const filter = { concentration: args.concentration };
    filters.push(filter);
  }

  if (args.ritual !== undefined) {
    const filter = { ritual: args.ritual };
    filters.push(filter);
  }

  if (args.attack_type) {
    const filter = { attack_type: { $in: args.attack_type } };
    filters.push(filter);
  }

  if (args.casting_time) {
    const filter = { casting_time: { $in: args.casting_time } };
    filters.push(filter);
  }

  if (args.area_of_effect) {
    const { area_of_effect } = args;
    if (area_of_effect.type) {
      const filter = { 'area_of_effect.type': { $in: area_of_effect.type } };
      filters.push(filter);
    }
    if (area_of_effect.size) {
      filters.push(resolveNumberFilter(area_of_effect.size, 'area_of_effect.size'));
    }
  }

  if (args.damage_type) {
    const filter = { 'damage.damage_type.index': { $in: args.damage_type } };
    filters.push(filter);
  }

  if (args.dc_type) {
    const filter = { 'dc.dc_type.index': { $in: args.dc_type } };
    filters.push(filter);
  }

  if (args.range) {
    const filter = { range: { $in: args.range } };
    filters.push(filter);
  }

  let sort = {};
  if (args.order) {
    sort = coalesceSort(args.order, resolveSpellOrderBy, 6);
  }

  return await Spell.find(coalesceFilters(filters))
    .sort(sort)
    .lean();
};

const coalesceFilters = filters => {
  let filter = {};
  if (filters.length === 1) {
    filter = filters[0];
  } else if (filters.length > 1) {
    filter = {
      $and: filters,
    };
  }

  return filter;
};

const coalesceSort = (order, getPropertyName, maxDepth) => {
  const sort = {};
  let depth = 0;

  do {
    if (depth >= maxDepth) {
      throw 'Maximum sort depth reached';
    }
    const propertyName = getPropertyName(order.by);
    let direction = getMongoSortDirection(order.direction);

    // The sizes happen to be in the correct order when counted in reverse-alphabetical order
    if (propertyName === 'size') {
      direction = -direction;
    }

    sort[propertyName] = direction;
    order = order.then_by;
    ++depth;
  } while (order);

  return sort;
};

const resolveNumberFilter = (value, propertyName) => {
  const filter = {};

  if (Array.isArray(value)) {
    filter[propertyName] = { $in: value };
  } else {
    const rangeFilter = {};
    if (value.lte) {
      rangeFilter.$lte = value.lte;
    }
    if (value.gte) {
      rangeFilter.$gte = value.gte;
    }
    if (value.lt) {
      rangeFilter.$lt = value.lt;
    }
    if (value.gt) {
      rangeFilter.$gt = value.gt;
    }

    filter[propertyName] = rangeFilter;
  }

  return filter;
};

const getMongoSortDirection = value => (value === 'ASCENDING' ? 1 : -1);

const levelObjectToArray = (obj, fieldName) =>
  Object.entries(obj).map(([level, value]) => ({ level, [fieldName]: value }));

module.exports = {
  equipmentBaseFieldResolvers,
  equipmentFieldResolvers,
  gearFieldResolvers,
  resolveGearType,
  resolveEquipmentType,
  levelObjectToArray,
  coalesceFilters,
  resolveNumberFilter,
  resolveSpells,
  getMongoSortDirection,
  coalesceSort,
};
