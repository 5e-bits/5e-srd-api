import { Schema } from 'mongoose';
import {
  APIReference,
  Choice,
  AreaOfEffect,
  DifficultyClass,
  Damage,
  Option,
  ReferenceOption,
  ActionOption,
  MultipleOption,
  StringOption,
  IdealOption,
  CountedReferenceOption,
  ScorePrerequisiteOption,
  AbilityBonusOption,
  BreathOption,
  DamageOption,
  ChoiceOption,
  OptionSet,
  OptionsArrayOptionSet,
  EquipmentCategoryOptionSet,
  ResourceListOptionSet,
} from './types';

export const APIReferenceSchema = new Schema<APIReference>({
  _id: false,
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
});

export const AreaOfEffectSchema = new Schema<AreaOfEffect>({
  _id: false,
  size: { type: Number, required: true },
  type: { type: String, index: true, enum: ['sphere', 'cube', 'cylinder', 'line', 'cone'] },
});

export const DifficultyClassSchema = new Schema<DifficultyClass>({
  _id: false,
  dc_type: { type: APIReferenceSchema, index: true },
  dc_value: { type: Number, index: true },
  success_type: { type: String, index: true, enum: ['none', 'half', 'other'] },
});

export const DamageSchema = new Schema<Damage>({
  _id: false,
  damage_type: { type: APIReferenceSchema, index: true },
  damage_dice: { type: String, index: true },
});

const Option = new Schema<Option>(
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

Option.discriminators['reference'] = new Schema<ReferenceOption>({
  item: { type: APIReferenceSchema, index: true, required: true },
});

Option.discriminators['action'] = new Schema<ActionOption>({
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

Option.discriminators['multiple'] = new Schema<MultipleOption>({
  items: { type: [Option], index: true, required: true },
});

Option.discriminators['string'] = new Schema<StringOption>({
  string: { type: String, index: true, required: true },
});

Option.discriminators['ideal'] = new Schema<IdealOption>({
  desc: { type: String, index: true, required: true },
  alignments: { type: [APIReferenceSchema], index: true, required: true },
});

Option.discriminators['counted_reference'] = new Schema<CountedReferenceOption>({
  count: { type: Number, index: true, required: true },
  of: { type: APIReferenceSchema, index: true, required: true },
});

Option.discriminators['score_prerequisite'] = new Schema<ScorePrerequisiteOption>({
  ability_score: { type: APIReferenceSchema, index: true, required: true },
  minimum_score: { type: Number, index: true, required: true },
});

Option.discriminators['ability_bonus'] = new Schema<AbilityBonusOption>({
  ability_score: { type: APIReferenceSchema, index: true, required: true },
  bonus: { type: Number, index: true, required: true },
});

Option.discriminators['breath'] = new Schema<BreathOption>({
  name: { type: String, index: true, required: true },
  dc: { type: DifficultyClassSchema, index: true, required: true },
  damage: { type: [DamageSchema], index: true },
});

Option.discriminators['damage'] = new Schema<DamageOption>({
  damage_type: { type: APIReferenceSchema, index: true, required: true },
  damage_dice: { type: String, index: true, required: true },
  notes: { type: String, index: true },
});

const OptionSetSchema = new Schema<OptionSet>(
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

OptionSetSchema.discriminators = {};

OptionSetSchema.discriminators['equipment_category'] = new Schema<EquipmentCategoryOptionSet>({
  equipment_category: { type: APIReferenceSchema, index: true, required: true },
});

OptionSetSchema.discriminators['resource_list'] = new Schema<ResourceListOptionSet>({
  resource_list_url: { type: String, index: true, required: true },
});

OptionSetSchema.discriminators['options_array'] = new Schema<OptionsArrayOptionSet>({
  options: { type: [Option], index: true, required: true },
});

export const ChoiceSchema = new Schema<Choice>({
  _id: false,
  desc: { type: String, index: true },
  choose: { type: Number, index: true, required: true },
  type: { type: String, index: true, required: true },
  from: { type: OptionSetSchema, index: true, required: true },
});

Option.discriminators['choice'] = new Schema<ChoiceOption>({
  choice: { type: ChoiceSchema, index: true, required: true },
});
