export type APIReference = {
  index: string;
  name: string;
  url: string;
};

export type Choice = {
  desc?: string;
  choose: number | string;
  type: string;
  from: OptionSet;
};

export interface AreaOfEffect {
  _id?: mongoose.Types.ObjectId;
  size: number;
  type: 'sphere' | 'cube' | 'cylinder' | 'line' | 'cone';
}

type OptionSet = OptionsArrayOptionSet | EquipmentCategoryOptionSet | ResourceListOptionSet;

type OptionsArrayOptionSet = {
  option_set_type: 'options_array';
  options: Option[];
};

type EquipmentCategoryOptionSet = {
  option_set_type: 'equipment_category';
  equipment_category: APIReference;
};

type ResourceListOptionSet = {
  option_set_type: 'resource_list';
  resource_list_url: string;
};

type DifficultyClass = {
  dc_type: APIReference;
  dc_value: number;
  success_type: 'none' | 'half' | 'other';
};

type Damage = {
  damage_type: APIReference;
  damage_dice: string;
};

type Option =
  | ReferenceOption
  | ActionOption
  | MultipleOption
  | ChoiceOption
  | StringOption
  | IdealOption
  | CountedReferenceOption
  | ScorePrerequisiteOption
  | AbilityBonusOption
  | BreathOption
  | DamageOption;

type ReferenceOption = {
  option_type: 'reference';
  item: APIReference;
};

type ActionOption = {
  option_type: 'action';
  action_name: string;
  count: number | string;
  type: 'melee' | 'ranged' | 'ability' | 'magic';
};

type MultipleOption = {
  option_type: 'multiple';
  items: Option[];
};

type ChoiceOption = {
  option_type: 'choice';
  choice: Choice;
};

type StringOption = {
  option_type: 'string';
  string: string;
};

type IdealOption = {
  option_type: 'ideal';
  desc: string;
  alignments: APIReference[];
};

type CountedReferenceOption = {
  option_type: 'counted_reference';
  count: number;
  of: APIReference;
};

type ScorePrerequisiteOption = {
  option_type: 'score_prerequisite';
  ability_score: APIReference;
  minimum_score: number;
};

type AbilityBonusOption = {
  option_type: 'ability_bonus';
  ability_score: APIReference;
  bonus: number;
};

type BreathOption = {
  option_type: 'breath';
  name: string;
  dc: DifficultyClass;
  damage?: Damage[];
};

type DamageOption = {
  option_type: 'damage';
  damage_type: APIReference;
  damage_dice: string;
  notes: string;
};
