const ClassModel = require('../../models/class');
const FeatureModel = require('../../models/feature');
const LevelModel = require('../../models/level');
const SpellModel = require('../../models/spell');

const Subclass = {
  class: async subclass => await ClassModel.findOne({ index: subclass.class.index }).lean(),
  subclass_levels: async subclass =>
    await LevelModel.find({ 'subclass.index': subclass.index }).lean(),
  spells: async subclass => {
    if (!subclass.spells) return null;

    const spells = await SpellModel.find({
      index: { $in: subclass.spells.map(s => s.spell.index) },
    }).lean();

    return subclass.spells.map(async s => ({
      spell: spells.find(sp => sp.index === s.spell.index),
      prerequisites: s.prerequisites.map(
        async p =>
          await (p.type == 'level'
            ? LevelModel.findOne({ index: p.index }).lean()
            : FeatureModel.findOne({ index: p.index }).lean())
      ),
    }));
  },
};

module.exports = Subclass;
