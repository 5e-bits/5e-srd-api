import { FieldResolver, Resolver, Root } from 'type-graphql'

import { createResolver } from '@/graphql/common/createResolver'
import { resolveSingleReference } from '@/graphql/utils/resolvers'
import ClassModel, { Class2024 } from '@/models/2024/class'
import SubclassModel, { Subclass2024 } from '@/models/2024/subclass'

@Resolver(Subclass2024)
export class SubclassResolver extends createResolver({
  Type: Subclass2024,
  Model: SubclassModel,
  typeName: 'Subclass',
  singular: 'subclass',
  plural: 'subclasses',
  descriptions: {
    fields: 'Fields to sort Subclasses by',
    order: 'Specify sorting order for subclasses.',
    list: 'Gets all subclasses, optionally filtered by name.',
    single: 'Gets a single subclass by index.'
  }
}) {
  @FieldResolver(() => Class2024, { nullable: true })
  async class(@Root() subclass: Subclass2024): Promise<Class2024 | null> {
    return resolveSingleReference(subclass.class, ClassModel)
  }
}
