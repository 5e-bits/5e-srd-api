import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { APIReference, AreaOfEffect } from '@/models/2014/common'
import { srdModelOptions } from '@/util/modelOptions'

export class SpellDamage {
  @prop({ type: () => APIReference })
  public damage_type?: APIReference

  @prop({ mapProp: true, type: () => Object, default: undefined })
  public damage_at_slot_level?: Record<number, string>

  @prop({ mapProp: true, type: () => Object, default: undefined })
  public damage_at_character_level?: Record<number, string>
}

export class SpellDC {
  @prop({ type: () => APIReference, required: true })
  public dc_type!: APIReference

  @prop({ required: true, index: true, type: () => String })
  public dc_success!: string

  @prop({ index: true, type: () => String })
  public desc?: string
}

@srdModelOptions('2014-spells')
export class Spell {
  @prop({ type: () => AreaOfEffect })
  public area_of_effect?: AreaOfEffect

  @prop({ index: true, type: () => String })
  public attack_type?: string

  @prop({ required: true, index: true, type: () => Boolean })
  public ritual!: boolean

  @prop({ type: () => [APIReference], required: true })
  public classes!: APIReference[]

  @prop({ type: () => [String], required: true })
  public components!: string[]

  @prop({ index: true, type: () => Boolean })
  public concentration!: boolean

  @prop({ type: () => SpellDamage })
  public damage?: SpellDamage

  @prop({ type: () => SpellDC })
  public dc?: SpellDC

  @prop({ required: true, index: true, type: () => [String] })
  public desc!: string[]

  @prop({ required: true, index: true, type: () => String })
  public duration!: string

  @prop({ type: () => Object })
  public heal_at_slot_level?: Record<number, string>

  @prop({ type: () => [String] })
  public higher_level?: string[]

  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @prop({ required: true, index: true, type: () => Number })
  public level!: number

  @prop({ index: true, type: () => String })
  public material?: string

  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @prop({ required: true, index: true, type: () => String })
  public range!: string

  @prop({ type: () => APIReference, required: true })
  public school!: APIReference

  @prop({ type: () => [APIReference], required: true })
  public subclasses!: APIReference[]

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type SpellDocument = DocumentType<Spell>
const SpellModel = getModelForClass(Spell)

export default SpellModel
