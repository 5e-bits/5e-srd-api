import { prop } from '@typegoose/typegoose'
import { BasePropOptions } from '@typegoose/typegoose/lib/types'
import { Field, FieldOptions as GqlFieldOptions, Float, Int } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'

type ReturnTypeFuncValue = ReturnType<NonNullable<Parameters<typeof Field>[0]>>

type TypeDescriptor = { db: BasePropOptions['type']; gql: ReturnTypeFuncValue }

type FieldOptions = {
  /** Omit to keep the field out of the GraphQL schema. */
  description?: string
  required?: boolean
  index?: boolean
  gql?: Omit<GqlFieldOptions, 'description'>
  /** Extra Typegoose options, e.g. `default`. */
  db?: Omit<BasePropOptions, 'type' | 'required' | 'index'>
}

/**
 * Declares a model property for both Typegoose and Type-GraphQL. Like `@prop`, nothing is required
 * or indexed unless asked.
 */
export function field(
  type: () => TypeDescriptor,
  { description, required, index, gql, db }: FieldOptions = {}
): PropertyDecorator {
  return (target, key) => {
    prop({
      type: () => type().db,
      ...(required !== undefined && { required }),
      ...(index !== undefined && { index }),
      ...db
    })(target, key)
    if (description !== undefined) {
      Field(() => type().gql, { description, ...gql })(target, key)
    }
  }
}

const isDescriptor = (t: unknown): t is TypeDescriptor =>
  typeof t === 'object' && t !== null && 'db' in t && 'gql' in t

export const T = {
  String: { db: String, gql: String },
  Int: { db: Number, gql: Int },
  Float: { db: Number, gql: Float },
  Bool: { db: Boolean, gql: Boolean },
  /** A nested model, identical in the database and GraphQL. */
  Model: (model: ReturnTypeFuncValue): TypeDescriptor => ({ db: model, gql: model }),
  /** Stored as an APIReference, resolved to `type` in GraphQL. */
  Ref: (type: ReturnTypeFuncValue): TypeDescriptor => ({ db: APIReference, gql: type }),
  RefList: (type: ReturnTypeFuncValue): TypeDescriptor => ({ db: [APIReference], gql: [type] }),
  List: (type: ReturnTypeFuncValue | TypeDescriptor): TypeDescriptor =>
    isDescriptor(type) ? { db: [type.db], gql: [type.gql] } : { db: [type], gql: [type] }
}
