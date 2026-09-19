import { prop } from '@typegoose/typegoose'
import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType({ description: 'Defines an area of effect for spells or abilities.' })
export class AreaOfEffect {
  @Field(() => Int, { description: 'The size of the area of effect (e.g., radius in feet).' })
  @prop({ required: true, type: () => Number })
  public size!: number

  @Field(() => String, { description: 'The shape of the area of effect.' })
  @prop({ required: true, index: true, type: () => String })
  public type!: 'sphere' | 'cube' | 'cylinder' | 'line' | 'cone'
}
