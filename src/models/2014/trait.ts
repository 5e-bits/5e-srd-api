import { getModelForClass, prop } from '@typegoose/typegoose';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { APIReference, Choice, AreaOfEffect, DifficultyClass } from './common';

class Proficiency {
  @prop({ required: true, index: true })
  public index!: string;

  @prop({ required: true, index: true })
  public name!: string;

  @prop({ required: true, index: true })
  public url!: string;
}

class ActionDamage {
  @prop({ type: () => APIReference })
  public damage_type!: APIReference;

  @prop({ type: () => Object })
  public damage_at_character_level!: Record<string, string>;
}

export class Usage {
  @prop({ required: true, index: true })
  public type!: string;

  @prop({ required: true, index: true })
  public times!: number;
}

class Action {
  @prop({ required: true, index: true })
  public name!: string;

  @prop({ required: true, index: true })
  public desc!: string;

  @prop({ type: () => Usage })
  public usage!: Usage;

  @prop({ type: () => DifficultyClass })
  public dc!: DifficultyClass;

  @prop({ type: () => [ActionDamage] })
  public damage!: ActionDamage[];

  @prop({ type: () => AreaOfEffect })
  public area_of_effect!: AreaOfEffect;
}

class TraitSpecific {
  @prop({ type: () => Choice })
  public subtrait_options?: Choice;

  @prop({ type: () => Choice })
  public spell_options?: Choice;

  @prop({ type: () => APIReference })
  public damage_type?: APIReference;

  @prop({ type: () => Action })
  public breath_weapon?: Action;
}

export class Trait {
  @prop({ type: () => [String], required: true, index: true })
  public desc!: string[];

  @prop({ required: true, index: true })
  public index!: string;

  @prop({ required: true, index: true })
  public name!: string;

  @prop({ type: () => [Proficiency] })
  public proficiencies?: Proficiency[];

  @prop({ type: () => Choice })
  public proficiency_choices?: Choice;

  @prop({ type: () => Choice })
  public language_options?: Choice;

  @prop({ type: () => [APIReference] })
  public races?: APIReference[];

  @prop({ type: () => [APIReference] })
  public subraces?: APIReference[];

  @prop({ type: () => APIReference })
  public parent?: APIReference;

  @prop({ type: () => TraitSpecific })
  public trait_specific?: TraitSpecific;

  @prop({ required: true, index: true })
  public url!: string;

  @prop({ required: true, index: true })
  public updated_at!: string;
}

export type TraitDocument = DocumentType<Trait>;
const TraitModel = getModelForClass(Trait, {
  schemaOptions: { collection: '2014-traits' },
});

export default TraitModel;
