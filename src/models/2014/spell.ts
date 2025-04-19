import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { APIReference, AreaOfEffect } from '@/models/2014/common'
import { srdModelOptions } from '@/util/modelOptions'
class Damage {
  @prop({ type: Object })
  public damage_at_slot_level?: Record<number, string>

  @prop({ type: Object })
  public damage_at_character_level?: Record<number, string>

  @prop({ type: () => APIReference })
  public damage_type?: APIReference
}

class DC {
  @prop({ required: true, index: true })
  public dc_success!: string

  @prop({ type: () => APIReference, required: true })
  public dc_type!: APIReference

  @prop({ index: true })
  public desc?: string
}

@srdModelOptions('2014-spells')
export class Spell {
  @prop({ type: () => AreaOfEffect })
  public area_of_effect?: AreaOfEffect

  @prop({ index: true })
  public attack_type?: string

  @prop({ required: true, index: true })
  public casting_time!: string

  @prop({ type: () => [APIReference], required: true })
  public classes!: APIReference[]

  @prop({ type: [String], required: true, index: true })
  public components!: string[]

  @prop({ required: true, index: true })
  public concentration!: boolean

  @prop({ type: () => Damage })
  public damage?: Damage

  @prop({ type: () => DC })
  public dc?: DC

  @prop({ type: [String], required: true, index: true })
  public desc!: string[]

  @prop({ required: true, index: true })
  public duration!: string

  @prop({ type: Object })
  public heal_at_slot_level?: Record<number, string>

  @prop({ type: [String], index: true })
  public higher_level?: string[]

  @prop({ required: true, index: true })
  public index!: string

  @prop({ required: true })
  public level!: number

  @prop({ index: true })
  public material?: string

  @prop({ required: true, index: true })
  public name!: string

  @prop({ required: true, index: true })
  public range!: string

  @prop({ required: true, index: true })
  public ritual!: boolean

  @prop({ type: () => APIReference, required: true })
  public school!: APIReference

  @prop({ type: () => [APIReference] })
  public subclasses?: APIReference[]

  @prop({ required: true, index: true })
  public url!: string

  @prop({ required: true, index: true })
  public updated_at!: string
}

export type SpellDocument = DocumentType<Spell>
const SpellModel = getModelForClass(Spell)

export default SpellModel
