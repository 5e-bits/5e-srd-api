import { Schema } from 'mongoose';
import { APIReference } from '../common/types';

const APIReferenceSchema = new Schema<APIReference>({
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
});

// TODO: Don't do this, but instead use APIReferenceSchema
export { APIReferenceSchema as APIReference, APIReferenceSchema };
