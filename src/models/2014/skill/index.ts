import { Schema, model } from 'mongoose';
import { APIReferenceSchema } from '@/models/2014/common/index.js';
import { Skill } from './types.js';

const SkillSchema = new Schema<Skill>({
  _id: { type: String, select: false },
  ability_score: APIReferenceSchema,
  desc: { type: [String], index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
  updated_at: { type: String, index: true },
});

export default model('Skill', SkillSchema, '2014-skills');
