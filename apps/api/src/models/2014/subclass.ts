import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

import { Class } from './class'
import { Level } from './level'
import { Spell } from './spell'

@ObjectType({ description: 'Prerequisite for a subclass spell' })
export class Prerequisite {
  @field(T.String, { required: true, index: true, gql: false })
  public index!: string

  @field(T.String, { required: true, gql: false })
  public name!: string

  @field(T.String, { required: true, gql: false })
  public type!: string

  @field(T.String, { required: true, gql: false })
  public url!: string
}

@ObjectType({ description: 'Spell gained by a subclass' })
export class SubclassSpell {
  // Handled by SubclassSpellResolver
  @field(T.List(() => Prerequisite), { required: true, gql: false })
  public prerequisites!: Prerequisite[]

  @field(T.Ref(() => Spell), { description: 'The spell gained.', required: true })
  public spell!: APIReference
}

@ObjectType({
  description: 'Represents a subclass (e.g., Path of the Berserker, School of Evocation)'
})
@srdModelOptions('2014-subclasses')
export class Subclass {
  @field(T.Ref(() => Class), {
    description: 'The parent class for this subclass.',
    required: true,
    gql: { nullable: true }
  })
  public class!: APIReference

  @field(T.List(T.String), {
    description: 'Description of the subclass',
    required: true,
    index: true
  })
  public desc!: string[]

  @field(T.String, {
    description: 'Unique identifier for the subclass',
    required: true,
    index: true
  })
  public index!: string

  @field(T.String, { description: 'Name of the subclass', required: true, index: true })
  public name!: string

  @field(T.List(() => SubclassSpell), {
    description: 'Spells specific to this subclass.',
    gql: { nullable: true }
  })
  public spells?: SubclassSpell[]

  @field(T.String, {
    description: 'Flavor text describing the subclass',
    required: true,
    index: true
  })
  public subclass_flavor!: string

  @field(
    { db: () => String, gql: () => [Level] },
    {
      description: 'Features and abilities gained by level for this subclass.',
      required: true,
      index: true,
      gql: { nullable: true }
    }
  )
  public subclass_levels!: string

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.String, { description: 'Timestamp of the last update', required: true, index: true })
  public updated_at!: string
}

export type SubclassDocument = DocumentType<Subclass>
const SubclassModel = getModelForClass(Subclass)

export default SubclassModel
