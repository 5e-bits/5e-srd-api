import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Alignment = new Schema({
  _id: { type: String, select: false },
  desc: { type: String, index: true },
  abbreviation: { type: String, index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
});

export default mongoose.model('Alignment', Alignment, 'alignments');
