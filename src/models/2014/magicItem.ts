import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { APIReference } from './common'
import { srdModelOptions } from '@/util/modelOptions'
import { ObjectType, Field } from 'type-graphql'
import { IEquipmentBase } from '@/graphql/common/interfaces/IEquipmentBase'
import { EquipmentCategory } from './equipmentCategory'

@ObjectType({ description: 'The rarity level of a magic item.' })
export class Rarity {
  @Field(() => String, { description: 'Name of the rarity level (e.g., Common, Uncommon, Rare).' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string
}

@ObjectType({ description: 'Represents a magical item.', implements: IEquipmentBase })
@srdModelOptions('2014-magic-items')
export class MagicItem implements IEquipmentBase {
  @Field(() => String, { description: 'Unique identifier for the magic item.' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'Name of the magic item.' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => [String], { description: 'Description of the magic item and its effects.' })
  @prop({ type: () => [String], index: true })
  public desc!: string[]

  @Field(() => EquipmentCategory, { description: 'The category of the magic item.' })
  @prop({ type: () => APIReference, index: true })
  // @ts-expect-error This is a workaround to avoid TypeGraphQL errors
  public equipment_category!: APIReference

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string

  @Field(() => Rarity, { description: 'The rarity of the magic item.' })
  @prop({ required: true, index: true, type: () => Rarity })
  public rarity!: Rarity

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => [MagicItem], {
    description: 'Other magic items that are variants of this item.',
    nullable: true
  })
  @prop({ type: () => [APIReference], index: true, default: [] })
  public variants!: APIReference[]

  @Field(() => Boolean, {
    description: 'Indicates if this item is a variant (true) or a base item (false).'
  })
  @prop({ required: true, index: true, type: () => Boolean })
  public variant!: boolean

  @Field(() => String, {
    nullable: true,
    description: 'URL to an image of the magic item, if available.'
  })
  @prop({ type: () => String, index: true })
  public image?: string
}

export type MagicItemDocument = DocumentType<MagicItem>
const MagicItemModel = getModelForClass(MagicItem)

export default MagicItemModel
