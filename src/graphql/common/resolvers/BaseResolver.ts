import { ReturnModelType, DocumentType } from '@typegoose/typegoose'
import { QueryOptions } from 'mongoose' // Correct import for QueryOptions
import { ClassType } from 'type-graphql'
import { NameSortArgs } from '@/graphql/common/args/NameSortArgs'
import { OrderByDirection } from '@/graphql/common/enums'

// Define a type for the Typegoose model that the resolver will interact with
// Ensures the model is for a class type T that has at least name and index properties.
// Using `any` for now to bypass complex type checking, will refine if needed.
type TypegooseModel<T extends { name: string; index: string }> = ReturnModelType<ClassType<T>>

// BaseResolver is generic over T, which represents the Typegoose class/GraphQL ObjectType
export abstract class BaseResolver<T extends { name: string; index: string }> {
  protected model: TypegooseModel<T>
  protected objectType: ClassType<T>

  constructor(model: TypegooseModel<T>, objectType: ClassType<T>) {
    this.model = model
    this.objectType = objectType
  }

  // Protected method for fetching multiple documents with common filtering/sorting
  protected async _find(
    { name, order_direction }: NameSortArgs,
    queryOptions?: QueryOptions<DocumentType<T>>
  ): Promise<T[]> {
    // Return plain objects T[]
    const query = this.model.find()

    if (name !== undefined) {
      // Using a case-insensitive regex for partial matching
      query.where({ name: { $regex: new RegExp(name, 'i') } })
    }

    const sortOrder = order_direction === OrderByDirection.DESC ? -1 : 1
    // Type assertion needed because T['name'] is not guaranteed to be a valid sort key type
    query.sort({ name: sortOrder as any })

    // Apply any additional query options (like skip, limit, select) if provided
    if (queryOptions) {
      query.setOptions(queryOptions)
    }

    // Cast the result of lean() to T[] as lean returns plain objects
    return query.lean().exec() as Promise<T[]>
  }

  // Protected method for fetching a single document by its index field
  protected async _findOneByIndex(
    index: string,
    queryOptions?: QueryOptions<DocumentType<T>>
  ): Promise<T | null> {
    // Return plain object T or null
    // Cast filter { index } to any because T['index'] is not strictly 'index'
    const query = this.model.findOne({ index } as any)

    if (queryOptions) {
      query.setOptions(queryOptions)
    }

    // Cast the result of lean() to T | null
    return query.lean().exec() as Promise<T | null>
  }

  // Concrete resolvers will implement specific @Query methods calling these protected ones,
  // providing the correct GraphQL return types and descriptions.
}
