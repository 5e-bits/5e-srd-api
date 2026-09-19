import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { srdModelOptions } from '@/util/modelOptions'

import { EquipmentCategory2024 } from './equipmentCategory'

@ObjectType({ description: 'The rarity level of a 2024 magic item.' })
export class Rarity2024 {
  @Field(() => String, {
    description: 'The name of the rarity level (e.g., Common, Uncommon, Rare).'
  })
  @prop({ required: true, index: true, type: () => String })
  public name!: string
}

@ObjectType({ description: 'An item imbued with magical properties in D&D 5e 2024.' })
@srdModelOptions('2024-magic-items')
export class MagicItem2024 {
  @Field(() => String, {
    description: 'The unique identifier for this magic item (e.g., bag-of-holding).'
  })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'The name of the magic item.' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => String, { description: 'A description of the magic item.' })
  @prop({ required: true, type: () => String })
  public desc!: string

  @Field(() => String, { nullable: true, description: 'URL of an image for the magic item.' })
  @prop({ type: () => String, index: true })
  public image?: string

  @Field(() => EquipmentCategory2024, {
    description: 'The category of equipment this magic item belongs to.'
  })
  @prop({ type: () => APIReference, index: true })
  public equipment_category!: APIReference

  @Field(() => Boolean, {
    description: 'Whether this magic item requires attunement.'
  })
  @prop({ required: true, index: true, type: () => Boolean })
  public attunement!: boolean

  @Field(() => Boolean, {
    description: 'Indicates if this magic item is a variant of another item.'
  })
  @prop({ required: true, index: true, type: () => Boolean })
  public variant!: boolean

  @Field(() => [MagicItem2024], {
    nullable: true,
    description: 'Other magic items that are variants of this item.'
  })
  @prop({ type: () => [APIReference], index: true })
  public variants!: APIReference[]

  @Field(() => Rarity2024, { description: 'The rarity of the magic item.' })
  @prop({ required: true, index: true, type: () => Rarity2024 })
  public rarity!: Rarity2024

  @Field(() => String, {
    nullable: true,
    description: 'Class restriction for attunement (e.g., "by a wizard").'
  })
  @prop({ type: () => String, index: true })
  public limited_to?: string

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type MagicItemDocument = DocumentType<MagicItem2024>
const MagicItemModel = getModelForClass(MagicItem2024)

export default MagicItemModel
