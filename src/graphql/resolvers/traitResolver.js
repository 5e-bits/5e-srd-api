const ProficiencyModel = require('../../models/proficiency');
const TraitModel = require('../../models/trait');

const Trait = {
  proficiencies: async trait =>
    await ProficiencyModel.find({ index: { $in: trait.proficiencies.map(p => p.index) } }).lean(),
  parent: async trait =>
    trait.parent ? await TraitModel.findOne({ index: trait.parent.index }).lean() : null,
};

module.exports = Trait;
