import * as mongoose from 'mongoose';

const Alignment = new mongoose.Schema({
  _id: { type: String, select: false },
  desc: { type: String, index: true },
  abbreviation: { type: String, index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
});

module.exports = mongoose.model('Alignment', Alignment, 'alignments');
