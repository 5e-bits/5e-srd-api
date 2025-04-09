import {
  coalesceFilters,
  levelObjectToArray,
  resolveAreaOfEffect,
  resolveChoice,
  resolveDc,
  resolveContainsStringFilter,
} from './common.js';

import DamageTypeModel from '@/models/2014/damageType/index.js';
import ProficiencyModel from '@/models/2014/proficiency/index.js';
import RaceModel from '@/models/2014/race/index.js';
import SpellModel from '@/models/2014/spell/index.js';
import SubraceModel from '@/models/2014/subrace/index.js';
import TraitModel from '@/models/2014/trait/index.js';
import LanguageModel from '@/models/2014/language/index.js';

import { ResolvedDC, QueryParams } from './common.js';
import { Trait, Usage } from '@/models/2014/trait/index.js';
import { Option } from '@/models/2014/common/types.js';

type TraitSpecificClient = {
  breath_weapon?: {
    dc?: Promise<ResolvedDC>;
    damage?: any;
    usage?: any;
    area_of_effect?: any;
  };
  damage_type?: any;
  spell_options?: any;
  subtrait_options?: any;
};

const resolveUsage = (usage: Usage) => {
  const resolvedUsage = { ...usage, type: usage.type.toUpperCase().replace(/\s+/g, '_') };

  return resolvedUsage;
};

const TraitResolver = {
  proficiencies: async (trait: Trait, args: QueryParams) => {
    const filters: any[] = [
      {
        index: { $in: trait.proficiencies?.map((p) => p.index) },
      },
    ];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    return await ProficiencyModel.find(coalesceFilters(filters)).lean();
  },
  parent: async (trait: Trait) =>
    trait.parent ? await TraitModel.findOne({ index: trait.parent.index }).lean() : null,
  subraces: async (trait: Trait, args: QueryParams) => {
    const filters: any[] = [{ index: { $in: trait.subraces?.map((s) => s.index) } }];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    return await SubraceModel.find(coalesceFilters(filters)).lean();
  },
  races: async (trait: Trait, args: QueryParams) => {
    const filters: any[] = [{ index: { $in: trait.races?.map((r) => r.index) } }];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    return await RaceModel.find(coalesceFilters(filters)).lean();
  },
  proficiency_choices: async (trait: Trait) => {
    if (trait.proficiency_choices) {
      const { proficiency_choices } = trait;
      if ('options' in proficiency_choices.from) {
        const options = proficiency_choices.from.options.map(async (option: Option) => {
          if ('item' in option) {
            return {
              ...option,
              item: await ProficiencyModel.findOne({ index: option.item.index }).lean(),
            };
          }
        });
        return resolveChoice(proficiency_choices, {
          options,
        });
      }
    } else {
      return null;
    }
  },
  trait_specific: async (trait: Trait) => {
    const { trait_specific } = trait;
    if (!trait_specific) {
      return null;
    }

    const traitSpecificToReturn: TraitSpecificClient = {};

    if (trait_specific.breath_weapon) {
      traitSpecificToReturn.breath_weapon = {
        ...trait_specific.breath_weapon,
        dc: resolveDc(trait_specific.breath_weapon.dc),
        damage: trait_specific.breath_weapon.damage.map(async (damage) => ({
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

    if (trait_specific.spell_options && 'options' in trait_specific.spell_options.from) {
      const options = trait_specific.spell_options.from.options.map(async (option: Option) => {
        if ('item' in option) {
          return {
            ...option,
            item: await SpellModel.findOne({ index: option.item.index }),
          };
        }
      });
      traitSpecificToReturn.spell_options = resolveChoice(trait_specific.spell_options, {
        options,
      });
    }

    if (trait_specific.subtrait_options && 'options' in trait_specific.subtrait_options.from) {
      const options = trait_specific.subtrait_options.from.options.map(async (option: Option) => {
        if ('item' in option) {
          return {
            ...option,
            item: await TraitModel.findOne({ index: option.item.index }).lean(),
          };
        }
      });
      traitSpecificToReturn.subtrait_options = resolveChoice(trait_specific.subtrait_options, {
        options,
      });
    }

    return traitSpecificToReturn;
  },
  language_options: async (trait: Trait) => {
    if (trait.language_options) {
      const { language_options } = trait;
      if ('options' in language_options.from) {
        const options = language_options.from.options.map(async (option: Option) => {
          if ('item' in option) {
            return {
              ...option,
              item: await LanguageModel.findOne({ index: option.item.index }).lean(),
            };
          }
        });
        return resolveChoice(language_options, {
          options,
        });
      }
    } else {
      return null;
    }
  },
};

export default TraitResolver;
