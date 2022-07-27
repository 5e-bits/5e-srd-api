import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Language = new Schema({
  _id: { type: String, select: false },
  desc: { type: String, index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  script: { type: String, index: true },
  type: { type: String, index: true },
  typical_speakers: { type: [String], index: true },
  url: { type: String, index: true },
});

export default mongoose.model('Language', Language, 'languages');
