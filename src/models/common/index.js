import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const APIReference = new Schema({
  _id: false,
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
});

export const AreaOfEffect = new Schema({
  _id: false,
  size: { type: Number, required: true },
  type: { type: String, index: true, enum: ['sphere', 'cube', 'cylinder', 'line', 'cone'] },
});

const DifficultyClass = new Schema({
  _id: false,
  dc_type: { type: APIReference, index: true },
  dc_value: { type: Number, index: true },
  success_type: { type: String, index: true, enum: ['none', 'half', 'other'] },
});

const Damage = new Schema({
  _id: false,
  damage_type: { type: APIReference, index: true },
  damage_dice: { type: String, index: true },
});

const Option = new Schema(
  {
    _id: false,
    option_type: {
      type: String,
      index: true,
      required: true,
      enum: [
        'reference',
        'action',
        'multiple',
        'string',
        'ideal',
        'counted_reference',
        'score_prerequisite',
        'ability_bonus',
        'breath',
        'damage',
      ],
    },
  },
  { discriminatorKey: 'option_type', _id: false }
);

Option.discriminators = {};

Option.discriminators['reference'] = new Schema({
  _id: false,
  item: { type: APIReference, index: true, required: true },
});

Option.discriminators['action'] = new Schema({
  _id: false,
  action_name: { type: String, index: true, required: true },
  count: { type: Schema.Types.Mixed, index: true, required: true },
  type: {
    type: String,
    index: true,
    enum: ['melee', 'ranged', 'ability', 'magic'],
    required: true,
  },
  notes: { type: String, index: true },
});

Option.discriminators['multiple'] = new Schema({
  _id: false,
  items: { type: [Option], index: true, required: true },
});

Option.discriminators['string'] = new Schema({
  _id: false,
  string: { type: String, index: true, required: true },
});

Option.discriminators['ideal'] = new Schema({
  _id: false,
  desc: { type: String, index: true, required: true },
  alignments: { type: [APIReference], index: true, required: true },
});

Option.discriminators['counted_reference'] = new Schema({
  _id: false,
  count: { type: Number, index: true, required: true },
  of: { type: APIReference, index: true, required: true },
});

Option.discriminators['score_prerequisite'] = new Schema({
  _id: false,
  ability_score: { type: APIReference, index: true, required: true },
  minimum_score: { type: Number, index: true, required: true },
});

Option.discriminators['ability_bonus'] = new Schema({
  _id: false,
  ability_score: { type: APIReference, index: true, required: true },
  bonus: { type: Number, index: true, required: true },
});

Option.discriminators['breath'] = new Schema({
  _id: false,
  name: { type: String, index: true, required: true },
  dc: { type: DifficultyClass, index: true, required: true },
  damage: { type: [Damage], index: true },
});

Option.discriminators['damage'] = new Schema({
  _id: false,
  damage_type: { type: APIReference, index: true, required: true },
  damage_dice: { type: String, index: true, required: true },
  notes: { type: String, index: true },
});

const OptionSet = new Schema(
  {
    _id: false,
    option_set_type: {
      type: String,
      index: true,
      required: true,
      enum: ['equipment_category', 'resource_list', 'options_array'],
    },
  },
  { discriminatorKey: 'option_set_type', _id: false }
);

OptionSet.discriminators = {};

OptionSet.discriminators['equipment_category'] = new Schema({
  _id: false,
  equipment_category: { type: APIReference, index: true, required: true },
});

OptionSet.discriminators['resource_list'] = new Schema({
  _id: false,
  resource_list_url: { type: String, index: true, required: true },
});

OptionSet.discriminators['options_array'] = new Schema({
  _id: false,
  options: { type: [Option], index: true, required: true },
});

export const Choice = new Schema({
  _id: false,
  desc: { type: String, index: true },
  choose: { type: mongoose.Mixed, index: true, required: true },
  type: { type: String, index: true, required: true },
  from: { type: OptionSet, index: true, required: true },
});

Option.discriminators['choice'] = new Schema({
  _id: false,
  choice: { type: Choice, index: true, required: true },
});
