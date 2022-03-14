import { Schema } from 'mongoose';
// TODO: Don't do this, but instead use the APIReference
import { APIReference as APIReferenceType } from '../common/types';

const APIReference = new Schema<APIReferenceType>({
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
});

export { APIReference };
