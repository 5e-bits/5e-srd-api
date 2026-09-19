import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { srdModelOptions } from '@/util/modelOptions'

import { Class } from './class'
import { Race } from './race'

@ObjectType({
  description: 'Represents a skill, tool, weapon, armor, or saving throw proficiency.'
})
@srdModelOptions('2014-proficiencies')
export class Proficiency {
  @Field(() => [Class], { nullable: true, description: 'Classes that grant this proficiency.' })
  @prop({ type: () => [APIReference] })
  public classes?: APIReference[]

  @Field(() => String, { description: 'Unique identifier for this proficiency.' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'Name of the proficiency.' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => [Race], { nullable: true, description: 'Races that grant this proficiency.' })
  @prop({ type: () => [APIReference] })
  public races?: APIReference[]

  @prop({ type: () => APIReference })
  public reference!: APIReference

  @Field(() => String, {
    description: 'Category of proficiency (e.g., Armor, Weapons, Saving Throws, Skills).'
  })
  @prop({ required: true, index: true, type: () => String })
  public type!: string

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type ProficiencyDocument = DocumentType<Proficiency>
const ProficiencyModel = getModelForClass(Proficiency)

export default ProficiencyModel
