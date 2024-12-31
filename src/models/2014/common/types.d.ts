export type APIReference = {
  _id?: boolean;
  index: string;
  name: string;
  url: string;
};

export type Choice = {
  _id?: boolean;
  desc?: string;
  choose: number;
  type: string;
  from: OptionSet;
};

export interface AreaOfEffect {
  _id?: boolean;
  size: number;
  type: 'sphere' | 'cube' | 'cylinder' | 'line' | 'cone';
}

export type OptionSet = OptionsArrayOptionSet | EquipmentCategoryOptionSet | ResourceListOptionSet;

type OptionsArrayOptionSet = {
  _id?: boolean;
  option_set_type: 'options_array';
  options: Option[];
};

type EquipmentCategoryOptionSet = {
  _id?: boolean;
  option_set_type: 'equipment_category';
  equipment_category: APIReference;
};

type ResourceListOptionSet = {
  _id?: boolean;
  option_set_type: 'resource_list';
  resource_list_url: string;
};

type DifficultyClass = {
  _id?: boolean;
  dc_type: APIReference;
  dc_value?: number;
  success_type: 'none' | 'half' | 'other';
};

type Damage = {
  _id?: boolean;
  damage_type: APIReference;
  damage_dice: string;
};

export type Option =
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
  _id?: boolean;
  option_type: 'reference';
  item: APIReference;
};

type ActionOption = {
  _id?: boolean;
  option_type: 'action';
  action_name: string;
  count: number | string;
  type: 'melee' | 'ranged' | 'ability' | 'magic';
  notes: string;
};

type MultipleOption = {
  _id?: boolean;
  option_type: 'multiple';
  items: Option[];
};

type ChoiceOption = {
  _id?: boolean;
  option_type: 'choice';
  choice: Choice;
};

type StringOption = {
  _id?: boolean;
  option_type: 'string';
  string: string;
};

type IdealOption = {
  _id?: boolean;
  option_type: 'ideal';
  desc: string;
  alignments: APIReference[];
};

type CountedReferenceOption = {
  _id?: boolean;
  option_type: 'counted_reference';
  count: number;
  of: APIReference;
  prerequisites?: {
    type: 'proficiency';
    proficiency?: APIReference;
  }[];
};

type ScorePrerequisiteOption = {
  _id?: boolean;
  option_type: 'score_prerequisite';
  ability_score: APIReference;
  minimum_score: number;
};

type AbilityBonusOption = {
  _id?: boolean;
  option_type: 'ability_bonus';
  ability_score: APIReference;
  bonus: number;
};

type BreathOption = {
  _id?: boolean;
  option_type: 'breath';
  name: string;
  dc: DifficultyClass;
  damage?: Damage[];
};

type DamageOption = {
  _id?: boolean;
  option_type: 'damage';
  damage_type: APIReference;
  damage_dice: string;
  notes: string;
};
