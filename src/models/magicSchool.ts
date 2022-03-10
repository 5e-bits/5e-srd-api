import * as mongoose from 'mongoose';

interface MagicSchool extends mongoose.Document {
  _id?: mongoose.Types.ObjectId;
  desc: string;
  index: string;
  name: string;
  url: string;
}

const MagicSchoolSchema = new mongoose.Schema<MagicSchool>({
  _id: { type: String, select: false },
  desc: { type: String, index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
});

export default mongoose.model<MagicSchool>('MagicSchool', MagicSchoolSchema, 'magic-schools');
