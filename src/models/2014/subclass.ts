import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { field, T } from '@/util/fieldDectorator'
import { srdModelOptions } from '@/util/modelOptions'

import { Class } from './class'
import { Level } from './level'
import { Spell } from './spell'

@ObjectType({ description: 'Prerequisite for a subclass spell' })
export class Prerequisite {
  @field(() => T.String, { skipResolver: true })
  public index!: string

  @field(() => T.String, { skipResolver: true })
  public name!: string

  @field(() => T.String, { skipResolver: true })
  public type!: string

  @field(() => T.String, { skipResolver: true })
  public url!: string
}

@ObjectType({ description: 'Spell gained by a subclass' })
export class SubclassSpell {
  // Handled by SubclassSpellResolver
  @field(() => T.List(Prerequisite), { skipResolver: true })
  public prerequisites!: Prerequisite[]

  @field(() => T.Ref(Spell), { description: 'The spell gained.' })
  public spell!: APIReference
}

@ObjectType({
  description: 'Represents a subclass (e.g., Path of the Berserker, School of Evocation)'
})
@srdModelOptions('2014-subclasses')
export class Subclass {
  @field(() => T.Ref(Class), { description: 'The parent class for this subclass.', optional: true })
  public class!: APIReference

  @field(() => T.List(String), { description: 'Description of the subclass' })
  public desc!: string[]

  @field(() => T.String, { description: 'Unique identifier for the subclass' })
  public index!: string

  @field(() => T.String, { description: 'Name of the subclass' })
  public name!: string

  @field(() => T.List(SubclassSpell), {
    description: 'Spells specific to this subclass.',
    optional: true
  })
  public spells?: SubclassSpell[]

  @field(() => T.String, { description: 'Flavor text describing the subclass' })
  public subclass_flavor!: string

  @field(() => T.Link([Level]), {
    description: 'Features and abilities gained by level for this subclass.'
  })
  public subclass_levels!: string

  @field(() => T.String, { description: 'The canonical path of this resource in the REST API.' })
  public url!: string

  @field(() => T.String, { description: 'Timestamp of the last update.' })
  public updated_at!: string
}

export type SubclassDocument = DocumentType<Subclass>
const SubclassModel = getModelForClass(Subclass)

export default SubclassModel
