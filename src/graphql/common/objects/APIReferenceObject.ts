import { ObjectType, Field } from 'type-graphql'

@ObjectType({ description: 'Basic reference structure for linked resources.' })
export class APIReferenceObject {
  @Field(() => String, { description: 'Resource index for fetching details.' })
  index!: string

  @Field(() => String, { description: 'Name of the referenced resource.' })
  name!: string

  @Field(() => String, { description: 'URL of the referenced resource.' })
  url!: string
}
