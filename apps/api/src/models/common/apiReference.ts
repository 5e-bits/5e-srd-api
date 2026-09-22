import { prop } from '@typegoose/typegoose'
import { Field, ObjectType } from 'type-graphql'

// Base class representing a reference to another resource
@ObjectType({ description: 'Reference to another API resource' })
export class APIReference {
  @Field(() => String, { description: 'The resource index for the API resource' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'The name of the API resource' })
  @prop({ required: true, type: () => String })
  public name!: string

  @Field(() => String, { description: 'The URL of the API resource' })
  @prop({ required: true, type: () => String })
  public url!: string

  @Field(() => String, { nullable: true, description: 'A qualifier for this reference, e.g. a condition immunity that only applies in one form' })
  @prop({ index: true, type: () => String })
  public note?: string
}
