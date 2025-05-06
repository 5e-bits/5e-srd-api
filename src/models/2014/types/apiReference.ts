import { prop } from '@typegoose/typegoose'
import { ObjectType, Field } from 'type-graphql'

// Base class representing a reference to another resource
@ObjectType({ description: 'A reference to another API resource.' })
export class APIReference {
  @Field(() => String, { description: 'The index of the referenced resource.' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'The name of the referenced resource.' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => String, { description: 'The URL of the referenced resource.' })
  @prop({ required: true, index: true, type: () => String })
  public url!: string
}
