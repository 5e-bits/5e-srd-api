import * as mongoose from 'mongoose';

interface MagicSchool {
  _id?: mongoose.Types.ObjectId;
  desc: string;
  index: string;
  name: string;
  url: string;
}

const MagicSchool = new mongoose.Schema<MagicSchool>({
  _id: { type: String, select: false },
  desc: { type: String, index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
});

export default mongoose.model<MagicSchool>('MagicSchool', MagicSchool, 'magic-schools');
