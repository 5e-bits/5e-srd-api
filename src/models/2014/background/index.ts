import { Schema, model } from 'mongoose';
import { APIReferenceSchema, ChoiceSchema } from '@/models/2014/common/index.js';
import { Background, Feature, Equipment } from './types.js';

const EquipmentSchema = new Schema<Equipment>({
  _id: false,
  equipment: APIReferenceSchema,
  quantity: { type: Number, index: true },
});

const FeatureSchema = new Schema<Feature>({
  _id: false,
  name: { type: String, index: true },
  desc: { type: [String], index: true },
});

const BackgroundSchema = new Schema<Background>({
  _id: { type: String, select: false },
  index: { type: String, index: true },
  name: { type: String, index: true },
  starting_proficiencies: [APIReferenceSchema],
  language_options: ChoiceSchema,
  url: { type: String, index: true },
  starting_equipment: [EquipmentSchema],
  starting_equipment_options: { type: [ChoiceSchema], index: true },
  feature: FeatureSchema,
  personality_traits: ChoiceSchema,
  ideals: ChoiceSchema,
  bonds: ChoiceSchema,
  flaws: ChoiceSchema,
  updated_at: { type: String, index: true },
});

export default model('Background', BackgroundSchema, '2014-backgrounds');
