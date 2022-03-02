import * as mongoose from 'mongoose';
import { APIReference, APIReferenceSchema } from './common';

interface LanguageOptions {
  _id?: string;
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
  _id?: string;
  equipment: APIReference;
  quantity: number;
}

const Equipment = {
  _id: false,
  equipment: APIReferenceSchema,
  quantity: { type: Number, index: true },
};

interface StartingEquipmentOption {
  _id?: string;
  equipment: APIReference;
  quantity: number;
}

const StartingEquipmentOption = {
  _id: false,
  equipment: APIReferenceSchema,
  quantity: { type: Number, index: true },
};

interface StartingEquipmentOptions {
  _id?: string;
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

interface Background {
  _id?: string;
  index: string;
  name: string;
  starting_proficiencies: APIReference[];
  language_options: LanguageOptions;
  url: string;
  starting_equipment: Equipment[];
  starting_equipment_options: StartingEquipmentOptions[];
  feature: Feature;
  personality_trait: CharacteristicOptions;
  ideals: IdealOptions;
  bonds: CharacteristicOptions;
  flaws: CharacteristicOptions;
}

const Background = new mongoose.Schema<Background>({
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

export default mongoose.model<Background>('Background', Background, 'backgrounds');
