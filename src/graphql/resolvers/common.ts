import AbilityScoreModel from '../../models/abilityScore/index.js';
import EquipmentCategoryModel from '../../models/equipmentCategory/index.js';
import { Equipment } from '../../models/equipment/types';
import { DifficultyClass, AreaOfEffect, Choice } from '../../models/common/types';
import SpellModel from '../../models/spell/index.js';

export const equipmentBaseFieldResolvers = {
  equipment_category: async (equipment: Equipment) =>
    await EquipmentCategoryModel.findOne({ index: equipment.equipment_category.index }).lean(),
};

export const equipmentFieldResolvers = {
  ...equipmentBaseFieldResolvers,
  cost: (equipment: Equipment) => ({ ...equipment.cost, unit: equipment.cost.unit.toUpperCase() }),
};

export const gearFieldResolvers = {
  ...equipmentFieldResolvers,
  gear_category: async (gear: Equipment) =>
    await EquipmentCategoryModel.findOne({ index: gear.gear_category?.index }).lean(),
};

export const resolveGearType = (gear: Equipment) => {
  if (gear.contents) return 'Pack';
  if (gear.quantity) return 'Ammunition';
  if (gear.gear_category) return 'Gear';
  return null;
};

export const resolveEquipmentType = (equipment: Equipment) => {
  if (equipment.tool_category) return 'Tool';
  if (equipment.gear_category) return resolveGearType(equipment);
  if (equipment.armor_class) return 'Armor';
  if (equipment.weapon_category) return 'Weapon';
  if (equipment.vehicle_category) return 'Vehicle';
  return null;
};

const resolveSpellOrderBy = (value: string) =>
  value === 'AREA_OF_EFFECT_SIZE' ? 'area_of_effect.size' : value.toLowerCase();

export type SpellQuery = {
  name?: string;
  school?: string;
  level?: ResolveNumberValue;
  class?: string;
  subclass?: string;
  concentration?: boolean;
  ritual?: boolean;
  attack_type?: string;
  casting_time?: string;
  area_of_effect: {
    type: string;
    size: ResolveNumberValue;
  };
  damage_type?: string;
  dc_type?: string;
  range?: string;
  order?: Order;
  skip: number;
  limit: number;
};

export const resolveSpells = async (args: SpellQuery, baseFilters: any[]) => {
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

export const coalesceFilters = (filters: any[]) => {
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

type GetPropertyNameCallback = (_: string) => string;
export type Order = {
  by: string;
  direction: SortDirection;
  then_by?: Order;
};

export type QueryParams = {
  name?: string;
  order_direction?: SortDirection;
};
export type SortQuery = Record<string, 1 | -1>;
export const coalesceSort = (
  order: Order | undefined,
  getPropertyName: GetPropertyNameCallback,
  maxDepth: number
) => {
  const sort: SortQuery = {};
  let depth = 0;

  do {
    if (!order) {
      break;
    }
    if (depth >= maxDepth) {
      throw 'Maximum sort depth reached';
    }
    const propertyName = getPropertyName(order.by);
    const direction: 1 | -1 = getMongoSortDirection(order.direction, propertyName);

    sort[propertyName] = direction;
    order = order.then_by;
    ++depth;
  } while (order);

  return sort;
};

type ResolveNumberValue =
  | number[]
  | {
      lte?: number;
      gte?: number;
      lt?: number;
      gt?: number;
    };
type NumberFilter = Record<string, { $in: number[] } | RangeFilter>;
type RangeFilter = {
  $gte?: number;
  $lte?: number;
  $lt?: number;
  $gt?: number;
};

export const resolveNumberFilter = (value: ResolveNumberValue, propertyName: string) => {
  const filter: NumberFilter = {};

  if (Array.isArray(value)) {
    filter[propertyName] = { $in: value };
  } else {
    const rangeFilter: RangeFilter = {};
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

export type SortDirection = 'ASCENDING' | 'DESCENDING';
export const getMongoSortDirection = (value: SortDirection, propertyName?: string | undefined) => {
  if (value === 'ASCENDING') {
    // The sizes happen to be in the correct order when counted in reverse-alphabetical order
    if (propertyName === 'size') {
      return -1;
    }
    return 1;
  } else {
    // The sizes happen to be in the correct order when counted in reverse-alphabetical order
    if (propertyName === 'size') {
      return 1;
    }
    return -1;
  }
};

export const levelObjectToArray = (obj: Record<string, string | number>, fieldName: string) =>
  Object.entries(obj).map(([level, value]) => ({ level, [fieldName]: value }));

export type ResolvedDC = {
  type: string;
  success: string;
  value?: number;
};
export const resolveDc = async (dc: DifficultyClass) => {
  const resolvedDc: ResolvedDC = {
    type: await AbilityScoreModel.findOne({ index: dc.dc_type.index }).lean(),
    success: dc.success_type.toUpperCase(),
  };

  if (dc.dc_value) {
    resolvedDc.value = dc.dc_value;
  }

  return resolvedDc;
};

export const resolveChoice = (choice: Choice, fromOverride: any, replace = false) => ({
  ...choice,
  from: {
    ...(replace ? {} : choice.from),
    ...fromOverride,
  },
});

export const resolveAreaOfEffect = (areaOfEffect: AreaOfEffect) => ({
  ...areaOfEffect,
  type: areaOfEffect.type.toUpperCase(),
});

export const resolveContainsStringFilter = (val: string, prop = 'name') => ({
  [prop]: new RegExp(val, 'i'),
});
