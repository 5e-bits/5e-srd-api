import { ReturnModelType } from '@typegoose/typegoose'

import Translation2014Model from '@/models/2014/translation'
import Translation2024Model from '@/models/2024/translation'

function getTranslationModel(collectionName: string): ReturnModelType<any> | null {
  if (collectionName.startsWith('2014-')) return Translation2014Model
  if (collectionName.startsWith('2024-')) return Translation2024Model
  return null
}

function getSourceCollection(collectionName: string): string | null {
  const match = collectionName.match(/^\d{4}-(.+)$/)
  return match ? match[1] : null
}

export async function applyTranslation<T extends Record<string, unknown>>(
  doc: T | null,
  collectionName: string,
  lang: string
): Promise<T | null> {
  if (!doc || lang === 'en') return doc

  const TranslationModel = getTranslationModel(collectionName)
  const sourceCollection = getSourceCollection(collectionName)
  if (TranslationModel == null || sourceCollection == null) return doc

  const translation = await TranslationModel.findOne({
    source_index: doc.index,
    source_collection: sourceCollection,
    lang
  }).lean()

  if (translation == null) return doc
  return { ...doc, ...translation.fields }
}

export async function applyTranslationToList<T extends Record<string, unknown>>(
  docs: T[],
  collectionName: string,
  lang: string
): Promise<{ docs: T[]; wasTranslated: boolean }> {
  if (docs.length === 0 || lang === 'en') return { docs, wasTranslated: false }

  const TranslationModel = getTranslationModel(collectionName)
  const sourceCollection = getSourceCollection(collectionName)
  if (TranslationModel == null || sourceCollection == null) return { docs, wasTranslated: false }

  const indices = docs.map((d) => d.index as string).filter(Boolean)
  const translations = await TranslationModel.find({
    source_index: { $in: indices },
    source_collection: sourceCollection,
    lang
  }).lean()

  const translationMap = new Map<string, Record<string, unknown>>(
    translations.map((t: any) => [t.source_index, t.fields])
  )

  return {
    docs: docs.map((doc) => {
      const fields = translationMap.get(doc.index as string)
      if (!fields) return doc
      const applicableFields = Object.fromEntries(Object.entries(fields).filter(([key]) => key in doc))
      return { ...doc, ...applicableFields }
    }),
    wasTranslated: translationMap.size > 0
  }
}
