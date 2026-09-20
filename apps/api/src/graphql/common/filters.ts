import { NumberFilterInput, buildMongoQueryFromNumberFilter } from '@/graphql/common/inputs'
import { escapeRegExp } from '@/util'

/** A Mongo condition, or undefined when the argument was not supplied. */
export type Filter = Record<string, unknown> | undefined

export const regexFilter = (path: string, value?: string | null, exact = false): Filter => {
  if (value == null || value === '') return undefined
  const source = exact ? `^${escapeRegExp(value)}$` : escapeRegExp(value)
  return { [path]: { $regex: new RegExp(source, 'i') } }
}

export const inFilter = (path: string, values?: readonly unknown[] | null): Filter =>
  values != null && values.length > 0 ? { [path]: { $in: values } } : undefined

export const eqFilter = (path: string, value?: unknown): Filter =>
  value != null && value !== '' ? { [path]: value } : undefined

export const numberFilter = (path: string, filter?: NumberFilterInput | null): Filter => {
  const query = filter ? buildMongoQueryFromNumberFilter(filter) : null
  return query ? { [path]: query } : undefined
}
