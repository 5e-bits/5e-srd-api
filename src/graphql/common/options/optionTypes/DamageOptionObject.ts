import { ObjectType, Field } from 'type-graphql'
import { APIReferenceObject } from '../../objects' // This path should now resolve via index.ts

@ObjectType({ description: 'Option representing damage.' })
export class DamageOptionObject {
  @Field(() => String)
  readonly option_type = 'DamageOption' as const

  @Field(() => APIReferenceObject)
  damage_type!: APIReferenceObject

  @Field(() => String)
  damage_dice!: string

  @Field(() => String, { nullable: true })
  notes?: string
}
