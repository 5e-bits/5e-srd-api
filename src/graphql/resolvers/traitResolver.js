import {
  coalesceFilters,
  levelObjectToArray,
  resolveAreaOfEffect,
  resolveChoice,
  resolveDc,
  resolveNameFilter,
  resolveUsage,
} from './common.js';

import DamageTypeModel from '../../models/damageType/index.js';
import ProficiencyModel from '../../models/proficiency/index.js';
import RaceModel from '../../models/race/index.js';
import SpellModel from '../../models/spell/index.js';
import SubraceModel from '../../models/subrace/index.js';
import TraitModel from '../../models/trait/index.js';
import LanguageModel from '../../models/language/index.js';

const Trait = {
  proficiencies: async (trait, args) => {
    const filters = [
      {
        index: { $in: trait.proficiencies.map(p => p.index) },
      },
    ];

    if (args.name) {
      const filter = resolveNameFilter(args.name);
      filters.push(filter);
    }

    return await ProficiencyModel.find(coalesceFilters(filters)).lean();
  },
  parent: async trait =>
    trait.parent ? await TraitModel.findOne({ index: trait.parent.index }).lean() : null,
  subraces: async (trait, args) => {
    const filters = [{ index: { $in: trait.subraces.map(s => s.index) } }];

    if (args.name) {
      const filter = resolveNameFilter(args.name);
      filters.push(filter);
    }

    return await SubraceModel.find(coalesceFilters(filters)).lean();
  },
  races: async (trait, args) => {
    const filters = [{ index: { $in: trait.races.map(r => r.index) } }];

    if (args.name) {
      const filter = resolveNameFilter(args.name);
      filters.push(filter);
    }

    return await RaceModel.find(coalesceFilters(filters)).lean();
  },
  proficiency_choices: async trait => {
    if (trait.proficiency_choices) {
      const { proficiency_choices } = trait;
      return resolveChoice(proficiency_choices, {
        options: proficiency_choices.from.options.map(async option => ({
          ...option,
          item: await ProficiencyModel.findOne({ index: option.item.index }).lean(),
        })),
      });
    } else {
      return null;
    }
  },
  trait_specific: async trait => {
    const { trait_specific } = trait;
    if (!trait_specific) {
      return null;
    }

    const traitSpecificToReturn = {};

    if (trait_specific.breath_weapon) {
      traitSpecificToReturn.breath_weapon = {
        ...trait_specific.breath_weapon,
        dc: resolveDc(trait_specific.breath_weapon.dc),
        damage: trait_specific.breath_weapon.damage.map(async damage => ({
          damage_at_character_level: levelObjectToArray(damage.damage_at_character_level, 'damage'),
          damage_type: await DamageTypeModel.findOne({ index: damage.damage_type.index }).lean(),
        })),
        usage: resolveUsage(trait_specific.breath_weapon.usage),
        area_of_effect: resolveAreaOfEffect(trait_specific.breath_weapon.area_of_effect),
      };
    }

    if (trait_specific.damage_type) {
      traitSpecificToReturn.damage_type = await DamageTypeModel.findOne({
        index: trait_specific.damage_type.index,
      }).lean();
    }

    if (trait_specific.spell_options) {
      traitSpecificToReturn.spell_options = resolveChoice(trait_specific.spell_options, {
        options: trait_specific.spell_options.from.options.map(async option => ({
          ...option,
          item: await SpellModel.findOne({ index: option.item.index }),
        })),
      });
    }

    if (trait_specific.subtrait_options) {
      traitSpecificToReturn.subtrait_options = resolveChoice(trait_specific.subtrait_options, {
        options: trait_specific.subtrait_options.from.options.map(async option => ({
          ...option,
          item: await TraitModel.findOne({ index: option.item.index }).lean(),
        })),
      });
    }

    return traitSpecificToReturn;
  },
  language_options: async trait => {
    if (trait.language_options) {
      const { language_options } = trait;
      return resolveChoice(language_options, {
        options: language_options.from.options.map(async option => ({
          ...option,
          item: await LanguageModel.findOne({ index: option.item.index }).lean(),
        })),
      });
    } else {
      return null;
    }
  },
};

export default Trait;
