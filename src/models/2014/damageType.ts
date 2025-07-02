import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { field, T } from '@/util/fieldDectorator'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({ description: 'Represents a type of damage (e.g., Acid, Bludgeoning, Fire).' })
@srdModelOptions('2014-damage-types')
export class DamageType {
  @field(() => T.String, {
    description: 'The unique identifier for this damage type (e.g., acid).'
  })
  public index!: string

  @field(() => T.String, { description: 'The name of the damage type (e.g., Acid).' })
  public name!: string

  @field(() => T.List(String), { description: 'A description of the damage type.' })
  public desc!: string[]

  @field(() => T.String, { description: 'The canonical path of this resource in the REST API.' })
  public url!: string

  @field(() => T.String, { description: 'Timestamp of the last update.' })
  public updated_at!: string
}

export type DamageTypeDocument = DocumentType<DamageType>
const DamageTypeModel = getModelForClass(DamageType)

export default DamageTypeModel
