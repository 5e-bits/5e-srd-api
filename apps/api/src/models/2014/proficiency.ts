import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

import { Class } from './class'
import { Race } from './race'

@ObjectType({
  description: 'Represents a skill, tool, weapon, armor, or saving throw proficiency.'
})
@srdModelOptions('2014-proficiencies')
export class Proficiency {
  @field(T.RefList(() => Class), {
    description: 'Classes that grant this proficiency.',
    gql: { nullable: true }
  })
  public classes?: APIReference[]

  @field(T.String, {
    description: 'Unique identifier for this proficiency.',
    required: true,
    index: true
  })
  public index!: string

  @field(T.String, { description: 'Name of the proficiency.', required: true, index: true })
  public name!: string

  @field(T.RefList(() => Race), {
    description: 'Races that grant this proficiency.',
    gql: { nullable: true }
  })
  public races?: APIReference[]

  @field(T.Model(() => APIReference), { gql: false })
  public reference!: APIReference

  @field(T.String, {
    description: 'Category of proficiency (e.g., Armor, Weapons, Saving Throws, Skills).',
    required: true,
    index: true
  })
  public type!: string

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.String, { description: 'Timestamp of the last update.', required: true, index: true })
  public updated_at!: string
}

export type ProficiencyDocument = DocumentType<Proficiency>
const ProficiencyModel = getModelForClass(Proficiency)

export default ProficiencyModel
