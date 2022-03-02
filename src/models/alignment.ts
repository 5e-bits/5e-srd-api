import * as mongoose from 'mongoose';

interface Alignment {
  _id?: mongoose.Types.ObjectId;
  desc: string;
  abbreviation: string;
  index: string;
  name: string;
  url: string;
}

const Alignment = new mongoose.Schema<Alignment>({
  _id: { type: String, select: false },
  desc: { type: String, index: true },
  abbreviation: { type: String, index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
});

export default mongoose.model<Alignment>('Alignment', Alignment, 'alignments');
