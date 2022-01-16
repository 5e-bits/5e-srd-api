const AbilityScore = require('../../models/abilityScore');
const Alignment = require('../../models/alignment');
const Background = require('../../models/background');
const Class = require('../../models/class');
const Condition = require('../../models/condition');
const DamageType = require('../../models/damageType');
const Equipment = require('../../models/equipment');
const EquipmentCategory = require('../../models/equipmentCategory');
const Feat = require('../../models/feat');
const Feature = require('../../models/feature');
const Language = require('../../models/language');
const Level = require('../../models/level');
const MagicItem = require('../../models/magicItem');
const MagicSchool = require('../../models/magicSchool');
const Monster = require('../../models/monster');
const Proficiency = require('../../models/proficiency');
const Race = require('../../models/race');
const Rule = require('../../models/rule');
const RuleSection = require('../../models/ruleSection');
const Skill = require('../../models/skill');
const Spell = require('../../models/spell');
const Subclass = require('../../models/subclass');
const Subrace = require('../../models/subrace');
const Trait = require('../../models/trait');
const WeaponProperty = require('../../models/weaponProperty');
const {
  coalesceFilters,
  resolveNumberFilter,
  resolveSpells,
  getMongoSortDirection,
  coalesceSort,
} = require('./common');

const Query = {
  async abilityScore(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await AbilityScore.findOne(filter).lean();
  },
  async abilityScores(query, args) {
    const sort = {};

    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction);
    }

    return await AbilityScore.find()
      .sort(sort)
      .lean();
  },
  async alignment(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Alignment.findOne(filter).lean();
  },
  async alignments(query, args) {
    const sort = {};

    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction);
    }

    return await Alignment.find()
      .sort(sort)
      .lean();
  },
  async background(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Background.findOne(filter).lean();
  },
  async backgrounds(query, args) {
    const sort = {};

    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction);
    }

    return await Background.find()
      .sort(sort)
      .lean();
  },
  async class(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Class.findOne(filter).lean();
  },
  async classes(query, args) {
    let filter = {};
    if (args.hit_die) {
      filter = resolveNumberFilter(args.hit_die, 'hit_die');
    }

    let sort = {};
    if (args.order) {
      sort = coalesceSort(args.order, value => value.toLowerCase());
    }
    return await Class.find(filter)
      .sort(sort)
      .lean();
  },
  async condition(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Condition.findOne(filter).lean();
  },
  async conditions(query, args) {
    const sort = {};

    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction);
    }

    return Condition.find()
      .sort(sort)
      .lean();
  },
  async damageType(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await DamageType.findOne(filter).lean();
  },
  async damageTypes(query, args) {
    const sort = {};

    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction);
    }

    return await DamageType.find()
      .sort(sort)
      .lean();
  },
  async equipment(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Equipment.findOne(filter).lean();
  },
  async equipments(query, args) {
    let filter = {};
    if (args.equipment_category) {
      filter = { 'equipment_category.index': { $in: args.equipment_category } };
    }

    let sort = {};
    if (args.order) {
      sort = coalesceSort(args.order, value =>
        value === 'EQUIPMENT_CATEGORY' ? 'equipment_category.name' : value.toLowerCase()
      );
    }

    return await Equipment.find(filter)
      .sort(sort)
      .lean();
  },
  async equipmentCategory(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await EquipmentCategory.findOne(filter).lean();
  },
  async equipmentCategories(query, args) {
    const sort = {};
    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction);
    }

    return await EquipmentCategory.find()
      .sort(sort)
      .lean();
  },
  async feat(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Feat.findOne(filter).lean();
  },
  async feats(query, args) {
    const sort = {};

    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction);
    }

    return await Feat.find()
      .sort(sort)
      .lean();
  },
  async feature(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Feature.findOne(filter).lean();
  },
  async features(query, args) {
    const filters = [];
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

    return await Feature.find(coalesceFilters(filters)).lean();
  },
  async language(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Language.findOne(filter).lean();
  },
  async languages(query, args) {
    const filters = [];
    if (args.type) {
      const type = args.type[0].toUpperCase() + args.type.slice(1).toLowerCase();
      filters.push({ type });
    }

    if (args.script) {
      const filter = { script: { $in: args.script } };
      filters.push(filter);
    }

    return await Language.find(coalesceFilters(filters)).lean();
  },
  async level(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Level.findOne(filter).lean();
  },
  async levels(query, args) {
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

    return await Level.find(coalesceFilters(filters)).lean();
  },
  async magicItem(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await MagicItem.findOne(filter).lean();
  },
  async magicItems(query, args) {
    let filter = {};
    if (args.equipment_category) {
      filter = { 'equipment_category.index': { $in: args.equipment_category } };
    }

    let sort = {};
    if (args.order) {
      sort = coalesceSort(args.order, value =>
        value === 'EQUIPMENT_CATEGORY' ? 'equipment_category.name' : value.toLowerCase()
      );
    }

    return await MagicItem.find(filter)
      .sort(sort)
      .lean();
  },
  async magicSchool(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await MagicSchool.findOne(filter).lean();
  },
  async magicSchools(query, args) {
    const sort = {};
    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction);
    }

    return await MagicSchool.find()
      .sort(sort)
      .lean();
  },
  async monster(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Monster.findOne(filter).lean();
  },
  async monsters(query, args) {
    const filters = [];
    if (args.size) {
      const filter = { size: { $in: args.size } };
      filters.push(filter);
    }

    if (args.type) {
      const filter = { type: { $in: args.type } };
      filters.push(filter);
    }

    if (args.subtype) {
      const filter = { subtype: { $in: args.subtype } };
      filters.push(filter);
    }

    if (args.damage_immunity) {
      const filter = { damage_immunities: { $elemMatch: { $in: args.damage_immunity } } };
      filters.push(filter);
    }

    if (args.damage_resistance) {
      const filter = { damage_resistances: { $elemMatch: { $in: args.damage_resistance } } };
      filters.push(filter);
    }

    if (args.damage_vulnerability) {
      const filter = { damage_vulnerabilities: { $elemMatch: { $in: args.damage_vulnerability } } };
      filters.push(filter);
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

    return await Monster.find(coalesceFilters(filters)).lean();
  },
  async proficiency(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Proficiency.findOne(filter).lean();
  },
  async proficiencies(query, args) {
    const filters = [];
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

    return await Proficiency.find(coalesceFilters(filters)).lean();
  },
  async race(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Race.findOne(filter).lean();
  },
  async races(query, args) {
    const filters = [];
    if (args.ability_bonus) {
      const filter = {
        ability_bonuses: { $elemMatch: { 'ability_score.index': { $in: args.ability_bonus } } },
      };
      filters.push(filter);
    }

    if (args.size) {
      const filter = { size: { $in: args.size } };
      filters.push(filter);
    }

    if (args.language) {
      const filter = { languages: { $elemMatch: { index: { $in: args.language } } } };
      filters.push(filter);
    }

    if (args.speed) {
      filters.push(resolveNumberFilter(args.speed, 'speed'));
    }

    return await Race.find(coalesceFilters(filters)).lean();
  },
  async rule(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Rule.findOne(filter).lean();
  },
  async rules(query, args) {
    const sort = {};

    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction);
    }

    return await Rule.find()
      .sort(sort)
      .lean();
  },
  async ruleSection(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await RuleSection.findOne(filter).lean();
  },
  async ruleSections(query, args) {
    const sort = {};

    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction);
    }

    return await RuleSection.find()
      .sort(sort)
      .lean();
  },
  async skill(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Skill.findOne(filter).lean();
  },
  async skills(query, args) {
    let filter = {};
    if (args.ability_score) {
      filter = { 'ability_score.index': { $in: args.ability_score } };
    }

    return await Skill.find(filter).lean();
  },
  async spell(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Spell.findOne(filter).lean();
  },
  async spells(query, args) {
    return await resolveSpells(args, []);
  },
  async subclass(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Subclass.findOne(filter).lean();
  },
  async subclasses(query, args) {
    const sort = {};

    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction);
    }

    return await Subclass.find()
      .sort(sort)
      .lean();
  },
  async subrace(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Subrace.findOne(filter).lean();
  },
  async subraces(query, args) {
    const sort = {};

    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction);
    }

    return await Subrace.find()
      .sort(sort)
      .lean();
  },
  async trait(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await Trait.findOne(filter).lean();
  },
  async traits(query, args) {
    const sort = {};

    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction);
    }

    return await Trait.find()
      .sort(sort)
      .lean();
  },
  async weaponProperty(query, args) {
    const filter = args.index ? { index: args.index } : {};
    return await WeaponProperty.findOne(filter).lean();
  },
  async weaponProperties(query, args) {
    const sort = {};

    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction);
    }

    return await WeaponProperty.find()
      .sort(sort)
      .lean();
  },
};

module.exports = Query;
