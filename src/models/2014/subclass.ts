import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { APIReference } from '@/models/2014/common'
import { srdModelOptions } from '@/util/modelOptions'
import { ObjectType, Field } from 'type-graphql'

@ObjectType({ description: 'Prerequisite for a subclass spell' })
export class Prerequisite {
  // Fields skipped in Pass 1
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  // Fields skipped in Pass 1
  @prop({ required: true, type: () => String })
  public name!: string

  // Fields skipped in Pass 1
  @prop({ required: true, type: () => String })
  public type!: string

  // Fields skipped in Pass 1
  @prop({ required: true, type: () => String })
  public url!: string
}

@ObjectType({ description: 'Spell gained by a subclass' })
export class SubclassSpell {
  // Fields skipped in Pass 1
  @prop({ type: () => [Prerequisite], required: true })
  public prerequisites!: Prerequisite[]

  // Fields skipped in Pass 1
  @prop({ type: () => APIReference, required: true })
  public spell!: APIReference
}

@ObjectType({
  description: 'Represents a subclass (e.g., Path of the Berserker, School of Evocation)'
})
@srdModelOptions('2014-subclasses')
export class Subclass {
  // TODO: Pass 2 - API Reference
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

  // TODO: Pass 2/3 - Complex nested type array (SubclassSpell)
  @prop({ type: () => [SubclassSpell] })
  public spells?: SubclassSpell[]

  @Field(() => String, { description: 'Flavor text describing the subclass' })
  @prop({ required: true, index: true, type: () => String })
  public subclass_flavor!: string

  // TODO: Pass 2 - Reference to Level API (likely)
  @prop({ required: true, index: true, type: () => String })
  public subclass_levels!: string

  // url field is not exposed via GraphQL
  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type SubclassDocument = DocumentType<Subclass>
const SubclassModel = getModelForClass(Subclass)

export default SubclassModel
