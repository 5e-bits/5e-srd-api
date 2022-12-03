import { Schema, model } from 'mongoose';
import { APIReferenceSchema } from '../common/index.js';
import { Skill } from './types';

const SkillSchema = new Schema<Skill>({
  _id: { type: String, select: false },
  ability_score: APIReferenceSchema,
  desc: { type: [String], index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
});

export default model('Skill', SkillSchema, 'skills');
