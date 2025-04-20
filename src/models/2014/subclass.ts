import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { APIReference } from '@/models/2014/common'
import { srdModelOptions } from '@/util/modelOptions'

export class SubclassSpell {
  @prop({ type: () => [APIReference], required: true })
  public prerequisites!: APIReference[]

  @prop({ type: () => APIReference, required: true })
  public spell!: APIReference
}

@srdModelOptions('2014-subclasses')
export class Subclass {
  @prop({ type: () => APIReference, required: true })
  public class!: APIReference

  @prop({ required: true, index: true, type: () => String })
  public subclass_flavor!: string

  @prop({ required: true, index: true, type: () => [String] })
  public desc!: string[]

  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @prop({ required: true, index: true, type: () => Number })
  public subclass_levels!: number

  @prop({ type: () => [SubclassSpell] })
  public spells?: SubclassSpell[]

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type SubclassDocument = DocumentType<Subclass>
const SubclassModel = getModelForClass(Subclass)

export default SubclassModel
