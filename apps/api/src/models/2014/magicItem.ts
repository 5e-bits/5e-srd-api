import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

import { EquipmentCategory } from './equipmentCategory'

@ObjectType({ description: 'Rarity level of a magic item.' })
export class Rarity {
  @field(T.String, {
    description: 'The name of the rarity level (e.g., Common, Uncommon, Rare).',
    required: true,
    index: true
  })
  public name!: string
}

@ObjectType({ description: 'An item imbued with magical properties.' })
@srdModelOptions('2014-magic-items')
export class MagicItem {
  @field(T.List(T.String), {
    description: 'A description of the magic item, including its effects and usage.',
    index: true
  })
  public desc!: string[]

  @field(T.Ref(() => EquipmentCategory), {
    description: 'The category of equipment this magic item belongs to.',
    index: true
  })
  public equipment_category!: APIReference

  @field(T.String, {
    description: 'URL of an image for the magic item, if available.',
    index: true,
    gql: { nullable: true }
  })
  public image?: string

  @field(T.String, {
    description: 'The unique identifier for this magic item (e.g., adamantite-armor).',
    required: true,
    index: true
  })
  public index!: string

  @field(T.String, {
    description: 'The name of the magic item (e.g., Adamantite Armor).',
    required: true,
    index: true
  })
  public name!: string

  @field(T.Model(() => Rarity), {
    description: 'The rarity of the magic item.',
    required: true,
    index: true
  })
  public rarity!: Rarity

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.RefList(() => MagicItem), {
    description: 'Other magic items that are variants of this item.',
    index: true,
    gql: { nullable: true }
  })
  public variants!: APIReference[]

  @field(T.Bool, {
    description: 'Indicates if this magic item is a variant of another item.',
    required: true,
    index: true
  })
  public variant!: boolean

  @field(T.String, { description: 'Timestamp of the last update.', required: true, index: true })
  public updated_at!: string
}

export type MagicItemDocument = DocumentType<MagicItem>
const MagicItemModel = getModelForClass(MagicItem)

export default MagicItemModel
