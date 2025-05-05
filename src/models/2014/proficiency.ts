import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { APIReference } from '@/models/2014/common'
import { srdModelOptions } from '@/util/modelOptions'
import { ObjectType, Field } from 'type-graphql'

@ObjectType({
  description: 'Represents a skill, tool, weapon, armor, or saving throw proficiency.'
})
@srdModelOptions('2014-proficiencies')
export class Proficiency {
  // TODO: Pass 2 - API Reference array
  @prop({ type: () => [APIReference] })
  public classes?: APIReference[]

  @Field(() => String, { description: 'Unique identifier for this proficiency.' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'Name of the proficiency.' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  // TODO: Pass 2 - API Reference array
  @prop({ type: () => [APIReference] })
  public races?: APIReference[]

  // TODO: Pass 2 - API Reference (Corrected type from previous edit attempt)
  @prop({ type: () => APIReference })
  public reference!: APIReference

  @Field(() => String, {
    description: 'Category of proficiency (e.g., Armor, Weapons, Saving Throws, Skills).'
  })
  @prop({ required: true, index: true, type: () => String })
  public type!: string

  // TODO: Pass 2/3 - System field, handle later if needed
  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type ProficiencyDocument = DocumentType<Proficiency>
const ProficiencyModel = getModelForClass(Proficiency)

export default ProficiencyModel
