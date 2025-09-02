import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { field, T } from '@/util/fieldDectorator'
import { srdModelOptions } from '@/util/modelOptions'

import { Class } from './class'
import { Race } from './race'

@ObjectType({
  description: 'Represents a skill, tool, weapon, armor, or saving throw proficiency.'
})
@srdModelOptions('2014-proficiencies')
export class Proficiency {
  @field(() => T.RefList(Class), {
    description: 'Classes that grant this proficiency.',
    optional: true
  })
  public classes?: APIReference[]

  @field(() => T.String, { description: 'Unique identifier for this proficiency.' })
  public index!: string

  @field(() => T.String, { description: 'Name of the proficiency.' })
  public name!: string

  @field(() => T.RefList(Race), {
    description: 'Races that grant this proficiency.',
    optional: true
  })
  public races?: APIReference[]

  @field(() => T.Ref(Proficiency), { skipResolver: true })
  public reference!: APIReference

  @field(() => T.String, {
    description: 'Category of proficiency (e.g., Armor, Weapons, Saving Throws, Skills).'
  })
  public type!: string

  @field(() => T.String, { description: 'The canonical path of this resource in the REST API.' })
  public url!: string

  @field(() => T.String, { description: 'Timestamp of the last update' })
  public updated_at!: string
}

export type ProficiencyDocument = DocumentType<Proficiency>
const ProficiencyModel = getModelForClass(Proficiency)

export default ProficiencyModel
