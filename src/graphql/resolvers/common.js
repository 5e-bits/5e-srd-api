import AbilityScoreModel from '../../models/abilityScore/index.js';
import EquipmentCategoryModel from '../../models/equipmentCategory/index.js';
import SpellModel from '../../models/spell/index.js';

export const equipmentBaseFieldResolvers = {
  equipment_category: async equipment =>
    await EquipmentCategoryModel.findOne({ index: equipment.equipment_category.index }).lean(),
};

export const equipmentFieldResolvers = {
  ...equipmentBaseFieldResolvers,
  cost: equipment => ({ ...equipment.cost, unit: equipment.cost.unit.toUpperCase() }),
};

export const gearFieldResolvers = {
  ...equipmentFieldResolvers,
  gear_category: async gear =>
    await EquipmentCategoryModel.findOne({ index: gear.gear_category.index }).lean(),
};

export const resolveGearType = gear => {
  if (gear.contents) return 'Pack';
  if (gear.quantity) return 'Ammunition';
  if (gear.gear_category) return 'Gear';
  return null;
};

export const resolveEquipmentType = equipment => {
  if (equipment.tool_category) return 'Tool';
  if (equipment.gear_category) return resolveGearType(equipment);
  if (equipment.armor_class) return 'Armor';
  if (equipment.weapon_category) return 'Weapon';
  if (equipment.vehicle_category) return 'Vehicle';
  return null;
};

const resolveSpellOrderBy = value =>
  value === 'AREA_OF_EFFECT_SIZE' ? 'area_of_effect.size' : value.toLowerCase();

export const resolveSpells = async (args, baseFilters) => {
  const filters = [...baseFilters];
  if (args.name) {
    const filter = resolveContainsStringFilter(args.name);
    filters.push(filter);
  }

  if (args.school) {
    filters.push({ 'school.index': { $in: args.school } });
  }

  if (args.level) {
    filters.push(resolveNumberFilter(args.level, 'level'));
  }

  if (args.class) {
    filters.push({ classes: { $elemMatch: { index: { $in: args.class } } } });
  }

  if (args.subclass) {
    filters.push({ subclasses: { $elemMatch: { index: { $in: args.subclass } } } });
  }

  if (args.concentration !== undefined) {
    filters.push({ concentration: args.concentration });
  }

  if (args.ritual !== undefined) {
    filters.push({ ritual: args.ritual });
  }

  if (args.attack_type) {
    filters.push({ attack_type: { $in: args.attack_type } });
  }

  if (args.casting_time) {
    filters.push({ casting_time: { $in: args.casting_time } });
  }

  if (args.area_of_effect) {
    const { area_of_effect } = args;
    if (area_of_effect.type) {
      filters.push({ 'area_of_effect.type': { $in: area_of_effect.type } });
    }
    if (area_of_effect.size) {
      filters.push(resolveNumberFilter(area_of_effect.size, 'area_of_effect.size'));
    }
  }

  if (args.damage_type) {
    filters.push({ 'damage.damage_type.index': { $in: args.damage_type } });
  }

  if (args.dc_type) {
    filters.push({ 'dc.dc_type.index': { $in: args.dc_type } });
  }

  if (args.range) {
    filters.push({ range: { $in: args.range } });
  }

  let sort = {};
  if (args.order) {
    sort = coalesceSort(args.order, resolveSpellOrderBy, 6);
  }

  let skip = 0;
  if (args.skip) {
    skip = args.skip;
  }

  return await SpellModel.find(coalesceFilters(filters))
    .sort(sort)
    .skip(skip)
    .limit(args.limit)
    .lean();
};

export const coalesceFilters = filters => {
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

export const coalesceSort = (order, getPropertyName, maxDepth) => {
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

export const resolveNumberFilter = (value, propertyName) => {
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

export const getMongoSortDirection = value => (value === 'ASCENDING' ? 1 : -1);

export const levelObjectToArray = (obj, fieldName) =>
  Object.entries(obj).map(([level, value]) => ({ level, [fieldName]: value }));

export const resolveDc = async dc => {
  const resolvedDc = {
    type: await AbilityScoreModel.findOne({ index: dc.dc_type.index }).lean(),
    success: dc.success_type.toUpperCase(),
  };

  if (dc.dc_value) {
    resolvedDc.value = dc.dc_value;
  }

  return resolvedDc;
};

export const resolveUsage = usage => {
  const resolvedUsage = { ...usage, type: usage.type.toUpperCase().replace(/\s+/g, '_') };
  if (usage.rest_types) resolvedUsage.rest_types = usage.rest_types.map(rt => rt.toUpperCase());

  return resolvedUsage;
};

export const resolveChoice = (choice, fromOverride, replace = false) => ({
  ...choice,
  from: {
    ...(replace ? {} : choice.from),
    ...fromOverride,
  },
});

export const resolveAreaOfEffect = areaOfEffect => ({
  ...areaOfEffect,
  type: areaOfEffect.type.toUpperCase(),
});

export const resolveContainsStringFilter = (val, prop = 'name') => ({
  [prop]: new RegExp(val, 'i'),
});
