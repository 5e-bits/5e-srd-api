import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLType } from 'graphql'
import mongoose from 'mongoose'
import { MiddlewareFn } from 'type-graphql'

import { applyTranslation, applyTranslationToList } from '@/util/translation'

function getBaseTypeName(type: GraphQLType): string | null {
  if (type instanceof GraphQLNonNull) return getBaseTypeName(type.ofType)
  if (type instanceof GraphQLList) return getBaseTypeName(type.ofType)
  if (type instanceof GraphQLObjectType) return type.name
  return null
}

function isList(type: GraphQLType): boolean {
  if (type instanceof GraphQLNonNull) return isList(type.ofType)
  return type instanceof GraphQLList
}

function collectionNameForType(typeName: string): string | null {
  if (!mongoose.modelNames().includes(typeName)) return null
  return mongoose.model(typeName).collection.name
}

interface TranslationContext {
  lang?: string
}

export const TranslationMiddleware: MiddlewareFn<TranslationContext> = async (
  { context, info, args },
  next
) => {
  // Only apply to top-level Query fields, not field resolvers
  if (info.parentType.name !== 'Query') return next()

  const result = await next()
  if (result == null) return result

  const lang: string = (args as any).lang ?? context.lang ?? 'en'
  if (lang === 'en') return result

  const typeName = getBaseTypeName(info.returnType)
  if (typeName == null) return result

  const collectionName = collectionNameForType(typeName)
  if (collectionName === null) return result

  if (isList(info.returnType) && Array.isArray(result)) {
    const { docs } = await applyTranslationToList(
      result as Record<string, unknown>[],
      collectionName,
      lang
    )
    return docs
  }

  return applyTranslation(result as Record<string, unknown>, collectionName, lang)
}
