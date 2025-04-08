import AbilityScoreModel from '@/models/2014/abilityScore/index.js';
import ClassModel from '@/models/2014/class/index.js';
import DamageTypeModel from '@/models/2014/damageType/index.js';
import MagicSchoolModel from '@/models/2014/magicSchool/index.js';
import SubclassModel from '@/models/2014/subclass/index.js';
import {
  coalesceFilters,
  levelObjectToArray,
  resolveAreaOfEffect,
  resolveContainsStringFilter,
  QueryParams,
} from './common.js';

import { Spell } from '@/models/2014/spell/types.js';
import { DamageType } from '@/models/2014/damageType/index.js';

type SpellDamage = {
  damage_type?: DamageType;
  damage_at_slot_level?: Record<string, string | number>[];
  damage_at_character_level?: Record<string, string | number>[];
};

const Spell = {
  attack_type: (spell: Spell) => (spell.attack_type ? spell.attack_type.toUpperCase() : null),
  area_of_effect: (spell: Spell) =>
    spell.area_of_effect ? resolveAreaOfEffect(spell.area_of_effect) : null,
  classes: async (spell: Spell, args: QueryParams) => {
    const filters: any[] = [{ index: { $in: spell.classes.map((c) => c.index) } }];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    return await ClassModel.find(coalesceFilters(filters)).lean();
  },
  subclasses: async (spell: Spell, args: QueryParams) => {
    const filters: any[] = [{ index: { $in: spell.subclasses?.map((s) => s.index) } }];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    return await SubclassModel.find(coalesceFilters(filters)).lean();
  },
  damage: async (spell: Spell) => {
    if (!spell.damage) return null;
    const spellDamage: SpellDamage = {};
    if (spell.damage.damage_type)
      spellDamage.damage_type =
        (await DamageTypeModel.findOne({
          index: spell.damage.damage_type.index,
        }).lean()) || undefined;
    if (spell.damage.damage_at_slot_level)
      spellDamage.damage_at_slot_level = levelObjectToArray(
        spell.damage.damage_at_slot_level,
        'damage'
      );
    if (spell.damage.damage_at_character_level)
      spellDamage.damage_at_character_level = levelObjectToArray(
        spell.damage.damage_at_character_level,
        'damage'
      );

    return spellDamage;
  },
  dc: async (spell: Spell) =>
    spell.dc
      ? {
          ...spell.dc,
          type: await AbilityScoreModel.findOne({ index: spell.dc.dc_type.index }).lean(),
          success: spell.dc.dc_success.toUpperCase(),
        }
      : null,
  heal_at_slot_level: (spell: Spell) =>
    spell.heal_at_slot_level ? levelObjectToArray(spell.heal_at_slot_level, 'healing') : null,
  school: async (spell: Spell) =>
    await MagicSchoolModel.findOne({ index: spell.school.index }).lean(),
};

export default Spell;
