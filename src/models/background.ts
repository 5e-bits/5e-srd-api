import * as mongoose from 'mongoose';
import { APIReference, APIReferenceSchema } from './common';

interface LanguageOptions {
  _id?: mongoose.Types.ObjectId;
  choose: number;
  from: APIReference[];
  type: string;
}

const LanguageOptions = {
  _id: false,
  choose: { type: Number, index: true },
  from: [APIReferenceSchema],
  type: { type: String, index: true },
};

interface Equipment {
  _id?: mongoose.Types.ObjectId;
  equipment: APIReference;
  quantity: number;
}

const Equipment = {
  _id: false,
  equipment: APIReferenceSchema,
  quantity: { type: Number, index: true },
};

interface StartingEquipmentOption {
  _id?: mongoose.Types.ObjectId;
  equipment: APIReference;
  quantity: number;
}

const StartingEquipmentOption = {
  _id: false,
  equipment: APIReferenceSchema,
  quantity: { type: Number, index: true },
};

interface StartingEquipmentOptions {
  _id?: mongoose.Types.ObjectId;
  choose: number;
  from: StartingEquipmentOption[];
  type: string;
}

const StartingEquipmentOptions = {
  _id: false,
  choose: { type: Number, index: true },
  from: [StartingEquipmentOption],
  type: { type: String, index: true },
};

interface CharacteristicOptions {
  choose: number;
  from: string[];
  type: string;
}

const CharacteristicOptions = {
  choose: { type: Number, index: true },
  from: { type: [String], index: true },
  type: { type: String, index: true },
};

interface Ideal {
  desc: string;
  alignments: APIReference[];
}

const Ideal = {
  desc: { type: String, index: true },
  alignments: [APIReferenceSchema],
};

interface IdealOptions {
  choose: number;
  from: Ideal[];
  type: string;
}

const IdealOptions = {
  choose: { type: Number, index: true },
  from: [Ideal],
  type: { type: String, index: true },
};

interface Feature {
  name: string;
  desc: string[];
}

const Feature = {
  name: { type: String, index: true },
  desc: { type: [String], index: true },
};

interface Background extends mongoose.Document {
  _id?: mongoose.Types.ObjectId;
  index: string;
  name: string;
  starting_proficiencies: APIReference[];
  language_options: LanguageOptions;
  url: string;
  starting_equipment: Equipment[];
  starting_equipment_options: StartingEquipmentOptions[];
  feature: Feature;
  personality_traits: CharacteristicOptions;
  ideals: IdealOptions;
  bonds: CharacteristicOptions;
  flaws: CharacteristicOptions;
}

const BackgroundSchema = new mongoose.Schema<Background>({
  _id: { type: String, select: false },
  index: { type: String, index: true },
  name: { type: String, index: true },
  starting_proficiencies: [APIReferenceSchema],
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

export default mongoose.model<Background>('Background', BackgroundSchema, 'backgrounds');
