import { ObjectType, Field } from 'type-graphql'

@ObjectType({ description: 'Option set linked to a resource list URL.' })
export class ResourceListOptionSetObject {
  @Field(() => String)
  readonly option_set_type = 'resource_list' as const

  @Field(() => String, { description: 'URL to the list of resources (e.g., /api/proficiencies).' })
  resource_list_url!: string
}
