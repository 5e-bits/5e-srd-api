import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const APIReference = new Schema({
  _id: false,
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
});
