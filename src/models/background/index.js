import { APIReference } from '../common/index.js';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const LanguageOptions = new Schema({
  _id: false,
  choose: { type: Number, index: true },
  from: [APIReference],
  type: { type: String, index: true },
});

const Equipment = new Schema({
  _id: false,
  equipment: APIReference,
  quantity: { type: Number, index: true },
});

const StartingEquipmentOption = new Schema({
  _id: false,
  equipment: APIReference,
  quantity: { type: Number, index: true },
});

const StartingEquipmentOptions = new Schema({
  _id: false,
  choose: { type: Number, index: true },
  from: [StartingEquipmentOption],
  type: { type: String, index: true },
});

const Ideal = new Schema({
  _id: false,
  desc: { type: String, index: true },
  alignments: [APIReference],
});

const CharacteristicOptions = new Schema({
  _id: false,
  choose: { type: Number, index: true },
  from: { type: [String], index: true },
  type: { type: String, index: true },
});

const IdealOptions = new Schema({
  _id: false,
  choose: { type: Number, index: true },
  from: [Ideal],
  type: { type: String, index: true },
});

const Feature = new Schema({
  _id: false,
  name: { type: String, index: true },
  desc: { type: [String], index: true },
});

const Background = new Schema({
  _id: { type: String, select: false },
  index: { type: String, index: true },
  name: { type: String, index: true },
  starting_proficiencies: [APIReference],
  language_options: LanguageOptions,
  url: { type: String, index: true },
  starting_equipment: [Equipment],
  starting_equipment_options: [StartingEquipmentOptions],
  feature: Feature,
  personality_traits: CharacteristicOptions,
  ideals: IdealOptions,
  bonds: CharacteristicOptions,
  flaws: CharacteristicOptions,
});

export default mongoose.model('Background', Background, 'backgrounds');
