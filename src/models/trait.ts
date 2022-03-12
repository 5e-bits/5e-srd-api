import * as mongoose from 'mongoose';
import { APIReference, APIReferenceSchema } from './common';

interface ProficiencyChoices {
  choose: number;
  from: APIReference[];
  type: string;
}

const ProficiencyChoices = {
  choose: { type: Number, index: true },
  from: [APIReferenceSchema],
  type: { type: String, index: true },
};

interface Choice {
  choose: number;
  from: APIReference[];
  type: string;
}

const Choice = {
  choose: { type: Number, index: true },
  from: [APIReferenceSchema],
  type: { type: String, index: true },
};

interface ActionDamage {
  damage_type: APIReference;
  damage_at_character_level: {
    1: string;
    6: string;
    11: string;
    16: string;
  };
}

const ActionDamage = {
  damage_type: APIReferenceSchema,
  // As this has keys that are numbers, we have to use an `Object`, which you can't query subfields
  damage_at_character_level: Object,
};

interface Useage {
  type: string;
  time: string;
}

const Usage = {
  type: { type: String, index: true },
  times: { type: Number, index: true },
};

interface DC {
  dc_type: APIReference;
  success_type: string;
}

const DC = {
  dc_type: APIReferenceSchema,
  success_type: { type: String, index: true },
};

interface Action {
  name: string;
  desc: string;
  usage: Useage;
  dc: DC;
  damage: ActionDamage[];
}

const Action = {
  name: { type: String, index: true },
  desc: { type: String, index: true },
  usage: Usage,
  dc: DC,
  damage: [ActionDamage],
};

interface TraitSpecific {
  subtrait_options?: Choice;
  spell_options?: Choice;
  damage_type?: APIReference;
  breath_weapon?: Action;
}

const TraitSpecific = {
  subtrait_options: Choice,
  spell_options: Choice,
  damage_type: APIReferenceSchema,
  breath_weapon: Action,
};

interface Trait {
  _id?: mongoose.Types.ObjectId;
  desc: string;
  index: string;
  name: string;
  proficiencies: APIReference[];
  proficiency_choices?: ProficiencyChoices;
  races: APIReference[];
  subraces: APIReference[];
  parent?: APIReference;
  trait_specific?: TraitSpecific;
  url: string;
}

const Trait = new mongoose.Schema<Trait>({
  _id: { type: String, select: false },
  desc: { type: [String], index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  proficiencies: [APIReferenceSchema],
  proficiency_choices: ProficiencyChoices,
  races: [APIReferenceSchema],
  subraces: [APIReferenceSchema],
  parent: APIReferenceSchema,
  trait_specific: TraitSpecific,
  url: { type: String, index: true },
});

export default mongoose.model<Trait>('Trait', Trait, 'traits');
