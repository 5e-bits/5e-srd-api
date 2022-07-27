import ClassModel from '../../models/class/index.js';
import FeatureModel from '../../models/feature/index.js';
import LevelModel from '../../models/level/index.js';
import { resolveSpells } from './common.js';

const Subclass = {
  class: async subclass => await ClassModel.findOne({ index: subclass.class.index }).lean(),
  subclass_levels: async subclass =>
    await LevelModel.find({ 'subclass.index': subclass.index }).lean(),
  spells: async (subclass, args) => {
    if (!subclass.spells) return null;

    const spells = await resolveSpells(args, [
      {
        index: { $in: subclass.spells.map(s => s.spell.index) },
      },
    ]);

    let spellsToReturn = [];
    for (const spell of subclass.spells) {
      const s = spells.find(sp => sp.index === spell.spell.index);
      if (s) {
        spellsToReturn.push({
          spell: s,
          prerequisites: spell.prerequisites.map(
            async p =>
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

export default Subclass;
