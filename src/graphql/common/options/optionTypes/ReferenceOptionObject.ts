import { ObjectType, Field } from 'type-graphql'
import { APIReferenceObject } from '../../objects' // Adjusted import path

@ObjectType({ description: 'Option referencing another resource.' })
export class ReferenceOptionObject {
  @Field(() => String)
  readonly option_type = 'ReferenceOption' as const

  @Field(() => APIReferenceObject)
  item!: APIReferenceObject
}
