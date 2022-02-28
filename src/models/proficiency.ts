import * as mongoose from 'mongoose';
import { APIReference } from './common';

const Reference = {
  index: { type: String, index: true },
  name: { type: String, index: true },
  type: { type: String, index: true },
  url: { type: String, index: true },
};

const Proficiency = new mongoose.Schema({
  _id: { type: String, select: false },
  classes: [APIReference],
  index: { type: String, index: true },
  name: { type: String, index: true },
  races: [APIReference],
  references: [Reference],
  type: { type: String, index: true },
  url: { type: String, index: true },
});

module.exports = mongoose.model('Proficiency', Proficiency, 'proficiencies');
