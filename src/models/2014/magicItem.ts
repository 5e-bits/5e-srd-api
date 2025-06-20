import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { field, T } from '@/util/fieldDectorator'
import { srdModelOptions } from '@/util/modelOptions'

import { EquipmentCategory } from './equipmentCategory'

@ObjectType({ description: 'Rarity level of a magic item.' })
export class Rarity {
  @field(() => T.String, {
    description: 'The name of the rarity level (e.g., Common, Uncommon, Rare).'
  })
  public name!: string
}

@ObjectType({ description: 'An item imbued with magical properties.' })
@srdModelOptions('2014-magic-items')
export class MagicItem {
  @field(() => T.List(String), {
    description: 'A description of the magic item, including its effects and usage.'
  })
  public desc!: string[]

  @field(() => T.Ref(EquipmentCategory), {
    description: 'The category of equipment this magic item belongs to.'
  })
  public equipment_category!: APIReference

  @field(() => T.String, {
    description: 'URL of an image for the magic item, if available.',
    optional: true
  })
  public image?: string

  @field(() => T.String, {
    description: 'The unique identifier for this magic item (e.g., adamantite-armor).'
  })
  public index!: string

  @field(() => T.String, { description: 'The name of the magic item (e.g., Adamantite Armor).' })
  public name!: string

  @field(() => T.Model(Rarity), { description: 'The rarity of the magic item.' })
  public rarity!: Rarity

  @field(() => T.String, { description: 'The canonical path of this resource in the REST API.' })
  public url!: string

  @field(() => T.String, { description: 'Timestamp of the last update.' })
  public updated_at!: string

  @field(() => T.RefList(MagicItem), {
    description: 'Other magic items that are variants of this item.',
    optional: true
  })
  public variants?: APIReference[]

  @field(() => T.Bool, {
    description: 'Indicates if this magic item is a variant of another item.'
  })
  public variant!: boolean
}

export type MagicItemDocument = DocumentType<MagicItem>
const MagicItemModel = getModelForClass(MagicItem)

export default MagicItemModel
