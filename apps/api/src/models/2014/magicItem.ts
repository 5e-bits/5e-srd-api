import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { srdModelOptions } from '@/util/modelOptions'

import { EquipmentCategory } from './equipmentCategory'

@ObjectType({ description: 'Rarity level of a magic item.' })
export class Rarity {
  @Field(() => String, {
    description: 'The name of the rarity level (e.g., Common, Uncommon, Rare).'
  })
  @prop({ required: true, index: true, type: () => String })
  public name!: string
}

@ObjectType({ description: 'An item imbued with magical properties.' })
@srdModelOptions('2014-magic-items')
export class MagicItem {
  @Field(() => [String], {
    description: 'A description of the magic item, including its effects and usage.'
  })
  @prop({ type: () => [String], index: true })
  public desc!: string[]

  @Field(() => EquipmentCategory, {
    description: 'The category of equipment this magic item belongs to.'
  })
  @prop({ type: () => APIReference, index: true })
  public equipment_category!: APIReference

  @Field(() => String, {
    nullable: true,
    description: 'URL of an image for the magic item, if available.'
  })
  @prop({ type: () => String, index: true })
  public image?: string

  @Field(() => String, {
    description: 'The unique identifier for this magic item (e.g., adamantite-armor).'
  })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'The name of the magic item (e.g., Adamantite Armor).' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => Rarity, { description: 'The rarity of the magic item.' })
  @prop({ required: true, index: true, type: () => Rarity })
  public rarity!: Rarity

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => [MagicItem], {
    nullable: true,
    description: 'Other magic items that are variants of this item.'
  })
  @prop({ type: () => [APIReference], index: true })
  public variants!: APIReference[]

  @Field(() => Boolean, {
    description: 'Indicates if this magic item is a variant of another item.'
  })
  @prop({ required: true, index: true, type: () => Boolean })
  public variant!: boolean

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type MagicItemDocument = DocumentType<MagicItem>
const MagicItemModel = getModelForClass(MagicItem)

export default MagicItemModel
