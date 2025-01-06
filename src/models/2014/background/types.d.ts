import * as mongoose from 'mongoose';
import { APIReference, Choice } from '../common/types';

type Equipment = {
  _id?: boolean;
  equipment: APIReference;
  quantity: number;
};

type Feature = {
  _id?: boolean;
  name: string;
  desc: string[];
};

export type Background = {
  _id?: mongoose.Types.ObjectId;
  index: string;
  name: string;
  starting_proficiencies: APIReference[];
  language_options: Choice;
  url: string;
  starting_equipment: Equipment[];
  starting_equipment_options: Choice[];
  feature: Feature;
  personality_traits: Choice;
  ideals: Choice;
  bonds: Choice;
  flaws: Choice;
};
