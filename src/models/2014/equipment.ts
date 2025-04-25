import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { APIReference } from '@/models/2014/common'
import { srdModelOptions } from '@/util/modelOptions'

// Export nested classes
export class ArmorClass {
  @prop({ required: true, index: true, type: () => Number })
  public base!: number

  @prop({ required: true, index: true, type: () => Boolean })
  public dex_bonus!: boolean

  @prop({ index: true, type: () => Number })
  public max_bonus?: number
}

export class Content {
  @prop({ type: () => APIReference })
  public item!: APIReference

  @prop({ required: true, index: true, type: () => Number })
  public quantity!: number
}

export class Cost {
  @prop({ required: true, index: true, type: () => Number })
  public quantity!: number

  @prop({ required: true, index: true, type: () => String })
  public unit!: string
}

export class Damage {
  @prop({ required: true, index: true, type: () => String })
  public damage_dice!: string

  @prop({ type: () => APIReference })
  public damage_type!: APIReference
}

export class Range {
  @prop({ index: true, type: () => Number })
  public long?: number

  @prop({ required: true, index: true, type: () => Number })
  public normal!: number
}

export class Speed {
  @prop({ required: true, index: true, type: () => Number })
  public quantity!: number

  @prop({ required: true, index: true, type: () => String })
  public unit!: string
}

export class ThrowRange {
  @prop({ required: true, index: true, type: () => Number })
  public long!: number

  @prop({ required: true, index: true, type: () => Number })
  public normal!: number
}

export class TwoHandedDamage {
  @prop({ required: true, index: true, type: () => String })
  public damage_dice!: string

  @prop({ type: () => APIReference })
  public damage_type!: APIReference
}

@srdModelOptions('2014-equipment')
export class Equipment {
  @prop({ index: true, type: () => String })
  public armor_category?: string

  @prop({ type: () => ArmorClass })
  public armor_class?: ArmorClass

  @prop({ index: true, type: () => String })
  public capacity?: string

  @prop({ index: true, type: () => String })
  public category_range?: string

  @prop({ type: () => [Content] })
  public contents?: Content[]

  @prop({ type: () => Cost })
  public cost!: Cost

  @prop({ type: () => Damage })
  public damage?: Damage

  @prop({ required: true, index: true, type: () => [String] })
  public desc!: string[]

  @prop({ type: () => APIReference })
  public equipment_category!: APIReference

  @prop({ type: () => APIReference })
  public gear_category?: APIReference

  @prop({ index: true, type: () => String })
  public image?: string

  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @prop({ type: () => [APIReference] })
  public properties?: APIReference[]

  @prop({ index: true, type: () => Number })
  public quantity?: number

  @prop({ type: () => Range })
  public range?: Range

  @prop({ index: true, type: () => [String] })
  public special?: string[]

  @prop({ type: () => Speed })
  public speed?: Speed

  @prop({ index: true, type: () => Boolean })
  public stealth_disadvantage?: boolean

  @prop({ index: true, type: () => Number })
  public str_minimum?: number

  @prop({ type: () => ThrowRange })
  public throw_range?: ThrowRange

  @prop({ index: true, type: () => String })
  public tool_category?: string

  @prop({ type: () => TwoHandedDamage })
  public two_handed_damage?: TwoHandedDamage

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @prop({ index: true, type: () => String })
  public vehicle_category?: string

  @prop({ index: true, type: () => String })
  public weapon_category?: string

  @prop({ index: true, type: () => String })
  public weapon_range?: string

  @prop({ index: true, type: () => Number })
  public weight?: number

  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type EquipmentDocument = DocumentType<Equipment>
const EquipmentModel = getModelForClass(Equipment)

export default EquipmentModel
