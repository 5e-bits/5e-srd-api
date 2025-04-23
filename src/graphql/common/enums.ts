import { registerEnumType } from 'type-graphql'

// Define shared Enum for ordering
export enum OrderByDirection {
  ASC = 'ASC',
  DESC = 'DESC'
}

// Register the enum with TypeGraphQL once
registerEnumType(OrderByDirection, {
  name: 'OrderByDirection', // GraphQL name
  description: 'Sort direction'
})
