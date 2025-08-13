import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { field, T } from '@/util/fieldDectorator'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({
  description: 'A property that can be applied to a weapon, modifying its use or characteristics.'
})
@srdModelOptions('2014-weapon-properties')
export class WeaponProperty {
  @field(() => T.List(String), { description: 'A description of the weapon property.' })
  public desc!: string[]

  @field(() => T.String, {
    description: 'The unique identifier for this property (e.g., versatile).'
  })
  public index!: string

  @field(() => T.String, { description: 'The name of the property (e.g., Versatile).' })
  public name!: string

  @field(() => T.String, { description: 'The canonical path of this resource in the REST API.' })
  public url!: string

  @field(() => T.String, { description: 'Timestamp of the last update.' })
  public updated_at!: string
}

export type WeaponPropertyDocument = DocumentType<WeaponProperty>
const WeaponPropertyModel = getModelForClass(WeaponProperty)

export default WeaponPropertyModel
