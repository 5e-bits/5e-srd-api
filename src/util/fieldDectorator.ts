import { prop } from '@typegoose/typegoose'
import {
  BasePropOptions,
  ArrayPropOptions,
  MapPropOptions,
  PropOptionsForNumber,
  PropOptionsForString,
  VirtualOptions
} from '@typegoose/typegoose/lib/types'
import { SchemaTypes } from 'mongoose'
import { ReturnTypeFuncValue } from 'node_modules/type-graphql/build/typings/decorators/types'
import {
  Field,
  Int as GqlInt,
  Float as GqlFloat,
  FieldOptions as TypeGraphQLFieldOptions
} from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'

type TypegooseOptions =
  | BasePropOptions
  | ArrayPropOptions
  | MapPropOptions
  | PropOptionsForNumber
  | PropOptionsForString
  | VirtualOptions

type FieldOptions = AutoResolvedFieldOptions | ManualResolvedFieldOptions

type BaseFieldOptions = {
  optional?: boolean
  index?: boolean
  typegoose?: TypegooseOptions
}

type AutoResolvedFieldOptions = BaseFieldOptions & {
  description: string
  skipResolver?: false
  typeGraphQL?: TypeGraphQLFieldOptions
}

type ManualResolvedFieldOptions = BaseFieldOptions & {
  skipResolver: true
}

function isAutoResolvedFieldOptions(options: FieldOptions): options is AutoResolvedFieldOptions {
  return options.skipResolver !== true
}

export function field(type: () => TypeObject, options: FieldOptions): PropertyDecorator {
  const required = options.optional !== true
  const index = options.index ?? true

  return (...args) => {
    prop({ type: () => type().db, index, required, ...options.typegoose })(...args)

    if (isAutoResolvedFieldOptions(options)) {
      Field(() => type().gql, {
        description: options.description,
        nullable: !required,
        ...options.typeGraphQL
      })(...args)
    }
  }
}

type TypeObject = { db: BasePropOptions['type']; gql: ReturnTypeFuncValue }

function isTypeObject(type: unknown): type is TypeObject {
  return (
    type !== null &&
    typeof type === 'object' &&
    Object.hasOwn(type, 'gql') &&
    Object.hasOwn(type, 'db')
  )
}

/**
 * Creates a field type that is represented as a single APIReference object in the database, but as
 * an object of the given type in the GraphQL API
 */
function Ref(type: ReturnTypeFuncValue): TypeObject {
  return { db: APIReference, gql: type }
}

/**
 * Creates a field type that is represented as an array of APIReference objects in the database, but
 * as a list of the given type in the GraphQL API
 */
function RefList(type: ReturnTypeFuncValue): TypeObject {
  return { db: [APIReference], gql: [type] }
}

/**
 * Creates a field type that is represented as an array of a given type in both the database and the
 * GraphQL API
 */
function List(type: ReturnTypeFuncValue | TypeObject): TypeObject {
  if (isTypeObject(type)) {
    return { db: [type.db], gql: [type.gql] }
  }
  return { db: [type], gql: [type] }
}

/**
 * Creates a field type that has the same representation in the database & GraphQL API, i.e. a
 * nested model/schema.
 */
function Model(model: ReturnTypeFuncValue): TypeObject {
  return { db: model, gql: model }
}

/**
 * Creates a field type that is represented as a string in the database and REST API, but resolves
 * to a given type in the GraphQL API
 */
function Link(type: ReturnTypeFuncValue): TypeObject {
  return { db: String, gql: type }
}

export const T = {
  String: { db: SchemaTypes.String, gql: String },
  Int: { db: SchemaTypes.Int32, gql: GqlInt },
  Float: { db: SchemaTypes.Double, gql: GqlFloat },
  Bool: { db: SchemaTypes.Boolean, gql: Boolean },
  Ref,
  RefList,
  List,
  Model,
  Link
}
