const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { NamedAPIResource } = require('./common');

const SubraceAbilityBonus = new Schema({
  _id: false,
  ability_score: NamedAPIResource,
  bonus: Number,
});

const SubraceLanguageOption = new Schema({
  _id: false,
  choose: Number,
  from: [NamedAPIResource],
  type: String,
});

const SubraceRacialTraitOption = new Schema({
  _id: false,
  choose: Number,
  from: [NamedAPIResource],
  type: String,
});

const Subrace = new Schema({
  _id: {
    type: String,
    select: false,
  },
  ability_bonuses: [SubraceAbilityBonus],
  desc: String,
  index: String,
  language_options: SubraceLanguageOption,
  name: String,
  race: NamedAPIResource,
  racial_trait_options: SubraceRacialTraitOption,
  racial_traits: [NamedAPIResource],
  starting_proficiencies: [NamedAPIResource],
  url: String,
});

module.exports = mongoose.model('Subrace', Subrace, 'subraces');
