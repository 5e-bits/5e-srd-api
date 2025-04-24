import { ObjectType, Field } from 'type-graphql'
import { APIReferenceObject } from './APIReferenceObject'

@ObjectType({ description: 'Represents damage details.' })
export class DamageObject {
  @Field(() => APIReferenceObject, { description: 'Type of damage inflicted.' })
  damage_type!: APIReferenceObject // References DamageType

  @Field(() => String, { description: 'Damage expressed as dice formula (e.g., 3d6).' })
  damage_dice!: string
}
