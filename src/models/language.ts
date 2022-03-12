import * as mongoose from 'mongoose';

interface Language {
  _id?: mongoose.Types.ObjectId;
  desc?: string;
  index: string;
  name: string;
  script?: string;
  type: string;
  typical_speakers: string[];
  url: string;
}

const Language = new mongoose.Schema<Language>({
  _id: { type: String, select: false },
  desc: { type: String, index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  script: { type: String, index: true },
  type: { type: String, index: true },
  typical_speakers: { type: [String], index: true },
  url: { type: String, index: true },
});

export default mongoose.model<Language>('Language', Language, 'languages');
