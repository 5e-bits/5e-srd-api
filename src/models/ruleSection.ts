import * as mongoose from 'mongoose';

interface RuleSection extends mongoose.Document {
  _id?: mongoose.Types.ObjectId;
  desc: string;
  index: string;
  name: string;
  url: string;
}

const RuleSectionSchema = new mongoose.Schema<RuleSection>({
  _id: { type: String, select: false },
  desc: { type: String, index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
});

export default mongoose.model<RuleSection>('RuleSection', RuleSectionSchema, 'rule-sections');
