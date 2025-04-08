import ClassModel from '@/models/2014/class/index.js';
import FeatureModel from '@/models/2014/feature/index.js';
import LevelModel from '@/models/2014/level/index.js';
import { resolveSpells, SpellQuery } from './common.js';

import { Subclass } from '@/models/2014/subclass/types.js';

const SubclassResolver = {
  class: async (subclass: Subclass) =>
    await ClassModel.findOne({ index: subclass.class.index }).lean(),
  subclass_levels: async (subclass: Subclass) =>
    await LevelModel.find({ 'subclass.index': subclass.index }).lean(),
  spells: async (subclass: Subclass, args: SpellQuery) => {
    if (!subclass.spells) return null;

    const spells = await resolveSpells(args, [
      {
        index: { $in: subclass.spells.map((s) => s.spell.index) },
      },
    ]);

    const spellsToReturn = [];
    for (const spell of subclass.spells) {
      const s = spells.find((sp) => sp.index === spell.spell.index);
      if (s) {
        spellsToReturn.push({
          spell: s,
          prerequisites: spell.prerequisites.map(
            async (p) =>
              await (p.type == 'level'
                ? LevelModel.findOne({ index: p.index }).lean()
                : FeatureModel.findOne({ index: p.index }).lean())
          ),
        });
      }
    }

    return spellsToReturn;
  },
};

export default SubclassResolver;
