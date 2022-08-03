import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Collection = new Schema({
  _id: { type: String, select: false },
  index: { type: String, index: true },
});

export default mongoose.model('Collection', Collection, 'collections');
