import { getModelForClass, prop } from '@typegoose/typegoose';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { APIReference } from '@/models/2014/common';

class ArmorClass {
  @prop({ required: true, index: true })
  public base!: number;

  @prop({ required: true, index: true })
  public dex_bonus!: boolean;

  @prop({ index: true })
  public max_bonus?: number;
}

class Content {
  @prop({ type: () => APIReference })
  public item!: APIReference;

  @prop({ required: true, index: true })
  public quantity!: number;
}

class Cost {
  @prop({ required: true, index: true })
  public quantity!: number;

  @prop({ required: true, index: true })
  public unit!: string;
}

class Damage {
  @prop({ required: true, index: true })
  public damage_dice!: string;

  @prop({ type: () => APIReference })
  public damage_type!: APIReference;
}

class Range {
  @prop({ index: true })
  public long?: number;

  @prop({ required: true, index: true })
  public normal!: number;
}

class Speed {
  @prop({ required: true, index: true })
  public quantity!: number;

  @prop({ required: true, index: true })
  public unit!: string;
}

class ThrowRange {
  @prop({ required: true, index: true })
  public long!: number;

  @prop({ required: true, index: true })
  public normal!: number;
}

class TwoHandedDamage {
  @prop({ required: true, index: true })
  public damage_dice!: string;

  @prop({ type: () => APIReference })
  public damage_type!: APIReference;
}

export class Equipment {
  @prop({ index: true })
  public armor_category?: string;

  @prop({ type: () => ArmorClass })
  public armor_class?: ArmorClass;

  @prop({ index: true })
  public capacity?: string;

  @prop({ index: true })
  public category_range?: string;

  @prop({ type: () => [Content] })
  public contents?: Content[];

  @prop({ type: () => Cost })
  public cost!: Cost;

  @prop({ type: () => Damage })
  public damage?: Damage;

  @prop({ required: true, index: true })
  public desc!: string[];

  @prop({ type: () => APIReference })
  public equipment_category!: APIReference;

  @prop({ type: () => APIReference })
  public gear_category?: APIReference;

  @prop({ required: true, index: true })
  public index!: string;

  @prop({ required: true, index: true })
  public name!: string;

  @prop({ type: () => [APIReference] })
  public properties?: APIReference[];

  @prop({ index: true })
  public quantity?: number;

  @prop({ type: () => Range })
  public range?: Range;

  @prop({ index: true })
  public special?: string[];

  @prop({ type: () => Speed })
  public speed?: Speed;

  @prop({ index: true })
  public stealth_disadvantage?: boolean;

  @prop({ index: true })
  public str_minimum?: number;

  @prop({ type: () => ThrowRange })
  public throw_range?: ThrowRange;

  @prop({ index: true })
  public tool_category?: string;

  @prop({ type: () => TwoHandedDamage })
  public two_handed_damage?: TwoHandedDamage;

  @prop({ required: true, index: true })
  public url!: string;

  @prop({ index: true })
  public vehicle_category?: string;

  @prop({ index: true })
  public weapon_category?: string;

  @prop({ index: true })
  public weapon_range?: string;

  @prop({ index: true })
  public weight?: number;

  @prop({ required: true, index: true })
  public updated_at!: string;
}

export type EquipmentDocument = DocumentType<Equipment>;
const EquipmentModel = getModelForClass(Equipment, {
  schemaOptions: { collection: '2014-equipment' },
});

export default EquipmentModel;
