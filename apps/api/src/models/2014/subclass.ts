import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { srdModelOptions } from '@/util/modelOptions'

import { Class } from './class'
import { Level } from './level'
import { Spell } from './spell'

@ObjectType({ description: 'Prerequisite for a subclass spell' })
export class Prerequisite {
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @prop({ required: true, type: () => String })
  public name!: string

  @prop({ required: true, type: () => String })
  public type!: string

  @prop({ required: true, type: () => String })
  public url!: string
}

@ObjectType({ description: 'Spell gained by a subclass' })
export class SubclassSpell {
  // Handled by SubclassSpellResolver
  @prop({ type: () => [Prerequisite], required: true })
  public prerequisites!: Prerequisite[]

  @Field(() => Spell, { description: 'The spell gained.' })
  @prop({ type: () => APIReference, required: true })
  public spell!: APIReference
}

@ObjectType({
  description: 'Represents a subclass (e.g., Path of the Berserker, School of Evocation)'
})
@srdModelOptions('2014-subclasses')
export class Subclass {
  @Field(() => Class, { nullable: true, description: 'The parent class for this subclass.' })
  @prop({ type: () => APIReference, required: true })
  public class!: APIReference

  @Field(() => [String], { description: 'Description of the subclass' })
  @prop({ required: true, index: true, type: () => [String] })
  public desc!: string[]

  @Field(() => String, { description: 'Unique identifier for the subclass' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'Name of the subclass' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => [SubclassSpell], {
    nullable: true,
    description: 'Spells specific to this subclass.'
  })
  @prop({ type: () => [SubclassSpell] })
  public spells?: SubclassSpell[]

  @Field(() => String, { description: 'Flavor text describing the subclass' })
  @prop({ required: true, index: true, type: () => String })
  public subclass_flavor!: string

  @Field(() => [Level], {
    nullable: true,
    description: 'Features and abilities gained by level for this subclass.'
  })
  @prop({ required: true, index: true, type: () => String })
  public subclass_levels!: string

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type SubclassDocument = DocumentType<Subclass>
const SubclassModel = getModelForClass(Subclass)

export default SubclassModel
