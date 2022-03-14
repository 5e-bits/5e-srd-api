import * as mongoose from 'mongoose';
import { APIReference } from '../common/types';

type LanguageOptions = {
  _id?: mongoose.Types.ObjectId;
  choose: number;
  from: APIReference[];
  type: string;
};

type Equipment = {
  _id?: mongoose.Types.ObjectId;
  equipment: APIReference;
  quantity: number;
};

type StartingEquipmentOption = {
  _id?: mongoose.Types.ObjectId;
  equipment_category: APIReference;
};

type StartingEquipmentOptions = {
  _id?: mongoose.Types.ObjectId;
  choose: number;
  from: StartingEquipmentOption[];
  type: string;
};

type CharacteristicOptions = {
  choose: number;
  from: string[];
  type: string;
};

type Ideal = {
  desc: string;
  alignments: APIReference[];
};

type IdealOptions = {
  choose: number;
  from: Ideal[];
  type: string;
};

type Feature = {
  name: string;
  desc: string[];
};

export type Background = {
  _id?: mongoose.Types.ObjectId;
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
};
