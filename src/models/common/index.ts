import { Schema } from 'mongoose';

const APIReference = new Schema({
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
});

export { APIReference };
