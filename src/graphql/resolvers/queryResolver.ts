import {
  coalesceFilters,
  coalesceSort,
  getMongoSortDirection,
  resolveContainsStringFilter,
  resolveNumberFilter,
  resolveSpells,
} from './common.js';

import AbilityScoreModel from '../../models/abilityScore/index.js';
import AlignmentModel from '../../models/alignment/index.js';
import BackgroundModel from '../../models/background/index.js';
import ClassModel from '../../models/class/index.js';
import ConditionModel from '../../models/condition/index.js';
import DamageTypeModel from '../../models/damageType/index.js';
import EquipmentCategoryModel from '../../models/equipmentCategory/index.js';
import EquipmentModel from '../../models/equipment/index.js';
import FeatModel from '../../models/feat/index.js';
import FeatureModel from '../../models/feature/index.js';
import LanguageModel from '../../models/language/index.js';
import LevelModel from '../../models/level/index.js';
import MagicItemModel from '../../models/magicItem/index.js';
import MagicSchoolModel from '../../models/magicSchool/index.js';
import MonsterModel from '../../models/monster/index.js';
import ProficiencyModel from '../../models/proficiency/index.js';
import RaceModel from '../../models/race/index.js';
import RuleModel from '../../models/rule/index.js';
import RuleSectionModel from '../../models/ruleSection/index.js';
import SkillModel from '../../models/skill/index.js';
import SpellModel from '../../models/spell/index.js';
import SubclassModel from '../../models/subclass/index.js';
import SubraceModel from '../../models/subrace/index.js';
import TraitModel from '../../models/trait/index.js';
import WeaponPropertyModel from '../../models/weaponProperty/index.js';

import { SpellQuery } from './common';

type SortParams = Record<string, 1 | -1>;

const Query = {
  async abilityScore(_: any, args: Record<any, any>) {
    const filter = args.index ? { index: args.index } : {};
    return await AbilityScoreModel.findOne(filter).lean();
  },
  async abilityScores(_: any, args: Record<any, any>) {
    const sort: SortParams = {};
    const filters = [];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    if (args.full_name) {
      filters.push(resolveContainsStringFilter(args.full_name, 'full_name'));
    }

    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction);
    }

    return await AbilityScoreModel.find(coalesceFilters(filters))
      .sort(sort)
      .lean();
  },
  async alignment(_: any, args: Record<any, any>) {
    const filter = args.index ? { index: args.index } : {};
    return await AlignmentModel.findOne(filter).lean();
  },
  async alignments(_: any, args: Record<any, any>) {
    const sort: SortParams = {};
    const filters = [];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction);
    }

    return await AlignmentModel.find(coalesceFilters(filters))
      .sort(sort)
      .lean();
  },
  async background(_: any, args: Record<any, any>) {
    const filter = args.index ? { index: args.index } : {};
    return await BackgroundModel.findOne(filter).lean();
  },
  async backgrounds(_: any, args: Record<any, any>) {
    const sort: SortParams = {};
    const filters = [];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction);
    }

    return await BackgroundModel.find(coalesceFilters(filters))
      .sort(sort)
      .lean();
  },
  async class(_: any, args: Record<any, any>) {
    const filter = args.index ? { index: args.index } : {};
    return await ClassModel.findOne(filter).lean();
  },
  async classes(_: any, args: Record<any, any>) {
    const filters = [];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    if (args.hit_die) {
      filters.push(resolveNumberFilter(args.hit_die, 'hit_die'));
    }

    let sort = {};
    if (args.order) {
      sort = coalesceSort(args.order, value => value.toLowerCase(), 2);
    }
    return await ClassModel.find(coalesceFilters(filters))
      .sort(sort)
      .lean();
  },
  async condition(_: any, args: Record<any, any>) {
    const filter = args.index ? { index: args.index } : {};
    return await ConditionModel.findOne(filter).lean();
  },
  async conditions(_: any, args: Record<any, any>) {
    const sort: SortParams = {};
    const filters = [];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction);
    }

    return ConditionModel.find(coalesceFilters(filters))
      .sort(sort)
      .lean();
  },
  async damageType(_: any, args: Record<any, any>) {
    const filter = args.index ? { index: args.index } : {};
    return await DamageTypeModel.findOne(filter).lean();
  },
  async damageTypes(_: any, args: Record<any, any>) {
    const sort: SortParams = {};
    const filters = [];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction);
    }

    return await DamageTypeModel.find(coalesceFilters(filters))
      .sort(sort)
      .lean();
  },
  async equipment(_: any, args: Record<any, any>) {
    const filter = args.index ? { index: args.index } : {};
    return await EquipmentModel.findOne(filter).lean();
  },
  async equipments(_: any, args: Record<any, any>) {
    const filters = [];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    if (args.equipment_category) {
      filters.push({ 'equipment_category.index': { $in: args.equipment_category } });
    }

    let sort = {};
    if (args.order) {
      sort = coalesceSort(
        args.order,
        value => (value === 'EQUIPMENT_CATEGORY' ? 'equipment_category.name' : value.toLowerCase()),
        3
      );
    }

    let skip = 0;
    if (args.skip) {
      skip = args.skip;
    }

    return await EquipmentModel.find(coalesceFilters(filters))
      .sort(sort)
      .skip(skip)
      .limit(args.limit)
      .lean();
  },
  async equipmentCategory(_: any, args: Record<any, any>) {
    const filter = args.index ? { index: args.index } : {};
    return await EquipmentCategoryModel.findOne(filter).lean();
  },
  async equipmentCategories(_: any, args: Record<any, any>) {
    const sort: SortParams = {};
    const filters = [];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction);
    }

    return await EquipmentCategoryModel.find(coalesceFilters(filters))
      .sort(sort)
      .lean();
  },
  async feat(_: any, args: Record<any, any>) {
    const filter = args.index ? { index: args.index } : {};
    return await FeatModel.findOne(filter).lean();
  },
  async feats(_: any, args: Record<any, any>) {
    const filters = [];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    const sort: SortParams = {};

    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction);
    }

    return await FeatModel.find(coalesceFilters(filters))
      .sort(sort)
      .lean();
  },
  async feature(_: any, args: Record<any, any>) {
    const filter = args.index ? { index: args.index } : {};
    return await FeatureModel.findOne(filter).lean();
  },
  async features(_: any, args: Record<any, any>) {
    const filters = [];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    if (args.level) {
      filters.push(resolveNumberFilter(args.level, 'level'));
    }

    if (args.class) {
      const filter = { 'class.index': { $in: args.class } };
      filters.push(filter);
    }

    if (args.subclass) {
      const filter = { 'subclass.index': { $in: args.subclass } };
      filters.push(filter);
    }

    let sort = {};
    if (args.order) {
      sort = coalesceSort(
        args.order,
        value => {
          switch (value) {
            case 'CLASS':
              return 'class.name';
            case 'SUBCLASS':
              return 'subclass.name';
            default:
              return value.toLowerCase();
          }
        },
        4
      );
    }

    let skip = 0;
    if (args.skip) {
      skip = args.skip;
    }

    return await FeatureModel.find(coalesceFilters(filters))
      .sort(sort)
      .skip(skip)
      .limit(args.limit)
      .lean();
  },
  async language(_: any, args: Record<any, any>) {
    const filter = args.index ? { index: args.index } : {};
    return await LanguageModel.findOne(filter).lean();
  },
  async languages(_: any, args: Record<any, any>) {
    const filters = [];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    if (args.type) {
      const type = args.type[0].toUpperCase() + args.type.slice(1).toLowerCase();
      filters.push({ type });
    }

    if (args.script) {
      const filter = { script: { $in: args.script } };
      filters.push(filter);
    }

    let sort = {};
    if (args.order) {
      sort = coalesceSort(args.order, value => value.toLowerCase(), 3);
    }

    return await LanguageModel.find(coalesceFilters(filters))
      .sort(sort)
      .lean();
  },
  async level(_: any, args: Record<any, any>) {
    const filter = args.index ? { index: args.index } : {};
    return await LevelModel.findOne(filter).lean();
  },
  async levels(_: any, args: Record<any, any>) {
    const filters = [];
    if (args.class) {
      const filter = { 'class.index': { $in: args.class } };
      filters.push(filter);
    }

    if (args.subclass) {
      const filter = { 'subclass.index': { $in: args.subclass } };
      filters.push(filter);
    }

    if (args.level) {
      filters.push(resolveNumberFilter(args.level, 'level'));
    }

    if (args.prof_bonus) {
      filters.push(resolveNumberFilter(args.prof_bonus, 'prof_bonus'));
    }

    if (args.ability_score_bonuses) {
      filters.push(resolveNumberFilter(args.ability_score_bonuses, 'ability_score_bonuses'));
    }

    let sort = {};
    if (args.order) {
      sort = coalesceSort(
        args.order,
        value => {
          switch (value) {
            case 'CLASS':
              return 'class.name';
            case 'SUBCLASS':
              return 'subclass.name';
            default:
              return value.toLowerCase();
          }
        },
        5
      );
    }

    let skip = 0;
    if (args.skip) {
      skip = args.skip;
    }

    return await LevelModel.find(coalesceFilters(filters))
      .sort(sort)
      .skip(skip)
      .limit(args.limit)
      .lean();
  },
  async magicItem(_: any, args: Record<any, any>) {
    const filter = args.index ? { index: args.index } : {};
    return await MagicItemModel.findOne(filter).lean();
  },
  async magicItems(_: any, args: Record<any, any>) {
    const filters = [];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    if (args.equipment_category) {
      const filter = { 'equipment_category.index': { $in: args.equipment_category } };
      filters.push(filter);
    }

    let sort = {};
    if (args.order) {
      sort = coalesceSort(
        args.order,
        value => (value === 'EQUIPMENT_CATEGORY' ? 'equipment_category.name' : value.toLowerCase()),
        2
      );
    }

    let skip = 0;
    if (args.skip) {
      skip = args.skip;
    }

    return await MagicItemModel.find(coalesceFilters(filters))
      .sort(sort)
      .skip(skip)
      .limit(args.limit)
      .lean();
  },
  async magicSchool(_: any, args: Record<any, any>) {
    const filter = args.index ? { index: args.index } : {};
    return await MagicSchoolModel.findOne(filter).lean();
  },
  async magicSchools(_: any, args: Record<any, any>) {
    const sort: SortParams = {};
    const filters = [];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction);
    }

    return await MagicSchoolModel.find(coalesceFilters(filters))
      .sort(sort)
      .lean();
  },
  async monster(_: any, args: Record<any, any>) {
    const filter = args.index ? { index: args.index } : {};
    return await MonsterModel.findOne(filter).lean();
  },
  async monsters(_: any, args: Record<any, any>) {
    const filters = [];
    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    if (args.size) {
      filters.push({ size: { $in: args.size } });
    }

    if (args.type) {
      filters.push({ type: { $in: args.type } });
    }

    if (args.subtype) {
      filters.push({ subtype: { $in: args.subtype } });
    }

    if (args.damage_immunity) {
      filters.push({ damage_immunities: { $elemMatch: { $in: args.damage_immunity } } });
    }

    if (args.damage_resistance) {
      filters.push({ damage_resistances: { $elemMatch: { $in: args.damage_resistance } } });
    }

    if (args.damage_vulnerability) {
      filters.push({ damage_vulnerabilities: { $elemMatch: { $in: args.damage_vulnerability } } });
    }

    if (args.armor_class) {
      filters.push(resolveNumberFilter(args.armor_class, 'armor_class'));
    }

    if (args.challenge_rating) {
      filters.push(resolveNumberFilter(args.challenge_rating, 'challenge_rating'));
    }

    if (args.charisma) {
      filters.push(resolveNumberFilter(args.charisma, 'charisma'));
    }

    if (args.constitution) {
      filters.push(resolveNumberFilter(args.constitution, 'constitution'));
    }

    if (args.dexterity) {
      filters.push(resolveNumberFilter(args.dexterity, 'dexterity'));
    }

    if (args.intelligence) {
      filters.push(resolveNumberFilter(args.intelligence, 'intelligence'));
    }

    if (args.strength) {
      filters.push(resolveNumberFilter(args.strength, 'strength'));
    }

    if (args.wisdom) {
      filters.push(resolveNumberFilter(args.wisdom, 'wisdom'));
    }

    if (args.xp) {
      filters.push(resolveNumberFilter(args.xp, 'xp'));
    }

    let sort = {};
    if (args.order) {
      sort = coalesceSort(args.order, value => value.toLowerCase(), 13);
    }

    let skip = 0;
    if (args.skip) {
      skip = args.skip;
    }

    return await MonsterModel.find(coalesceFilters(filters))
      .sort(sort)
      .skip(skip)
      .limit(args.limit)
      .lean();
  },
  async proficiency(_: any, args: Record<any, any>) {
    const filter = args.index ? { index: args.index } : {};
    return await ProficiencyModel.findOne(filter).lean();
  },
  async proficiencies(_: any, args: Record<any, any>) {
    const filters = [];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    if (args.class) {
      const filter = { classes: { $elemMatch: { index: { $in: args.class } } } };
      filters.push(filter);
    }

    if (args.race) {
      const filter = { races: { $elemMatch: { index: { $in: args.race } } } };
      filters.push(filter);
    }

    if (args.type) {
      const filter = { type: { $in: args.type } };
      filters.push(filter);
    }

    let sort = {};
    if (args.order) {
      sort = coalesceSort(args.order, value => value.toLowerCase(), 2);
    }

    let skip = 0;
    if (args.skip) {
      skip = args.skip;
    }

    return await ProficiencyModel.find(coalesceFilters(filters))
      .sort(sort)
      .skip(skip)
      .limit(args.limit)
      .lean();
  },
  async race(_: any, args: Record<any, any>) {
    const filter = args.index ? { index: args.index } : {};
    return await RaceModel.findOne(filter).lean();
  },
  async races(_: any, args: Record<any, any>) {
    const filters = [];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    if (args.ability_bonus) {
      filters.push({
        ability_bonuses: { $elemMatch: { 'ability_score.index': { $in: args.ability_bonus } } },
      });
    }

    if (args.size) {
      filters.push({ size: { $in: args.size } });
    }

    if (args.language) {
      filters.push({ languages: { $elemMatch: { index: { $in: args.language } } } });
    }

    if (args.speed) {
      filters.push(resolveNumberFilter(args.speed, 'speed'));
    }

    let sort = {};
    if (args.order) {
      sort = coalesceSort(args.order, value => value.toLowerCase(), 3);
    }

    return await RaceModel.find(coalesceFilters(filters))
      .sort(sort)
      .lean();
  },
  async rule(_: any, args: Record<any, any>) {
    const filter = args.index ? { index: args.index } : {};
    return await RuleModel.findOne(filter).lean();
  },
  async rules(_: any, args: Record<any, any>) {
    const sort: SortParams = {};
    const filters = [];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction);
    }

    return await RuleModel.find(coalesceFilters(filters))
      .sort(sort)
      .lean();
  },
  async ruleSection(_: any, args: Record<any, any>) {
    const filter = args.index ? { index: args.index } : {};
    return await RuleSectionModel.findOne(filter).lean();
  },
  async ruleSections(_: any, args: Record<any, any>) {
    const sort: SortParams = {};
    const filters = [];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction);
    }

    return await RuleSectionModel.find(coalesceFilters(filters))
      .sort(sort)
      .lean();
  },
  async skill(_: any, args: Record<any, any>) {
    const filter = args.index ? { index: args.index } : {};
    return await SkillModel.findOne(filter).lean();
  },
  async skills(_: any, args: Record<any, any>) {
    const filters = [];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    if (args.ability_score) {
      filters.push({ 'ability_score.index': { $in: args.ability_score } });
    }

    let sort = {};
    if (args.order) {
      sort = coalesceSort(
        args.order,
        value => (value === 'ABILITY_SCORE' ? 'ability_score.name' : value.toLowerCase()),
        2
      );
    }

    return await SkillModel.find(coalesceFilters(filters))
      .sort(sort)
      .lean();
  },
  async spell(_: any, args: Record<any, any>) {
    const filter = args.index ? { index: args.index } : {};
    return await SpellModel.findOne(filter).lean();
  },
  async spells(_: any, args: SpellQuery) {
    return await resolveSpells(args, []);
  },
  async subclass(_: any, args: Record<any, any>) {
    const filter = args.index ? { index: args.index } : {};
    return await SubclassModel.findOne(filter).lean();
  },
  async subclasses(_: any, args: Record<any, any>) {
    const sort: SortParams = {};
    const filters = [];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction);
    }

    return await SubclassModel.find(coalesceFilters(filters))
      .sort(sort)
      .lean();
  },
  async subrace(_: any, args: Record<any, any>) {
    const filter = args.index ? { index: args.index } : {};
    return await SubraceModel.findOne(filter).lean();
  },
  async subraces(_: any, args: Record<any, any>) {
    const sort: SortParams = {};
    const filters = [];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction);
    }

    return await SubraceModel.find(coalesceFilters(filters))
      .sort(sort)
      .lean();
  },
  async trait(_: any, args: Record<any, any>) {
    const filter = args.index ? { index: args.index } : {};
    return await TraitModel.findOne(filter).lean();
  },
  async traits(_: any, args: Record<any, any>) {
    const sort: SortParams = {};
    const filters = [];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction);
    }

    return await TraitModel.find(coalesceFilters(filters))
      .sort(sort)
      .lean();
  },
  async weaponProperty(_: any, args: Record<any, any>) {
    const filter = args.index ? { index: args.index } : {};
    return await WeaponPropertyModel.findOne(filter).lean();
  },
  async weaponProperties(_: any, args: Record<any, any>) {
    const sort: SortParams = {};
    const filters = [];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction);
    }

    return await WeaponPropertyModel.find(coalesceFilters(filters))
      .sort(sort)
      .lean();
  },
};

export default Query;
