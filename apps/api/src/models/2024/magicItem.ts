import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

import { EquipmentCategory2024 } from './equipmentCategory'

@ObjectType({ description: 'The rarity level of a 2024 magic item.' })
export class Rarity2024 {
  @field(T.String, {
    description: 'The name of the rarity level (e.g., Common, Uncommon, Rare).',
    required: true,
    index: true
  })
  public name!: string
}

@ObjectType({ description: 'An item imbued with magical properties in D&D 5e 2024.' })
@srdModelOptions('2024-magic-items')
export class MagicItem2024 {
  @field(T.String, {
    description: 'The unique identifier for this magic item (e.g., bag-of-holding).',
    required: true,
    index: true
  })
  public index!: string

  @field(T.String, { description: 'The name of the magic item.', required: true, index: true })
  public name!: string

  @field(T.List(T.String), {
    description: 'A description of the magic item, as Markdown paragraphs and tables.',
    required: true
  })
  public desc!: string[]

  @field(T.String, {
    description: 'URL of an image for the magic item.',
    index: true,
    gql: { nullable: true }
  })
  public image?: string

  @field(T.Ref(() => EquipmentCategory2024), {
    description: 'The category of equipment this magic item belongs to.',
    index: true
  })
  public equipment_category!: APIReference

  @field(T.Bool, {
    description: 'Whether this magic item requires attunement.',
    required: true,
    index: true
  })
  public attunement!: boolean

  @field(T.Bool, {
    description: 'Indicates if this magic item is a variant of another item.',
    required: true,
    index: true
  })
  public variant!: boolean

  @field(T.RefList(() => MagicItem2024), {
    description: 'Other magic items that are variants of this item.',
    index: true,
    gql: { nullable: true }
  })
  public variants!: APIReference[]

  @field(T.Model(() => Rarity2024), {
    description: 'The rarity of the magic item.',
    required: true,
    index: true
  })
  public rarity!: Rarity2024

  @field(T.String, {
    description: 'Class restriction for attunement (e.g., "by a wizard").',
    index: true,
    gql: { nullable: true }
  })
  public limited_to?: string

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.String, { description: 'Timestamp of the last update.', required: true, index: true })
  public updated_at!: string
}

export type MagicItemDocument = DocumentType<MagicItem2024>
const MagicItemModel = getModelForClass(MagicItem2024)

export default MagicItemModel
