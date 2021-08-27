const ProficiencyModel = require('../../models/proficiency');
const RaceModel = require('../../models/race');
const Subrace = require('../../models/subrace');
const TraitModel = require('../../models/trait');

const Trait = {
  proficiencies: async trait =>
    await ProficiencyModel.find({ index: { $in: trait.proficiencies.map(p => p.index) } }).lean(),
  parent: async trait =>
    trait.parent ? await TraitModel.findOne({ index: trait.parent.index }).lean() : null,
  subraces: async trait =>
    await Subrace.find({ index: { $in: trait.subraces.map(s => s.index) } }).lean(),
  races: async trait =>
    await RaceModel.find({ index: { $in: trait.races.map(r => r.index) } }).lean(),
};

module.exports = Trait;
