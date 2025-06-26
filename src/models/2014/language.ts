import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { field, T } from '@/util/fieldDectorator'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({ description: 'Represents a language spoken in the D&D world.' })
@srdModelOptions('2014-languages')
export class Language {
  @field(() => T.String, { description: 'A brief description of the language.', optional: true })
  public desc?: string

  @field(() => T.String, { description: 'The unique identifier for this language (e.g., common).' })
  public index!: string

  @field(() => T.String, { description: 'The name of the language (e.g., Common).' })
  public name!: string

  @field(() => T.String, {
    description: 'The script used to write the language (e.g., Common, Elvish).',
    optional: true
  })
  public script?: string

  @field(() => T.String, { description: 'The type of language (e.g., Standard, Exotic).' })
  public type!: string

  @field(() => T.List(String), { description: 'Typical speakers of the language.' })
  public typical_speakers!: string[]

  @field(() => T.String, { description: 'The canonical path of this resource in the REST API.' })
  public url!: string

  @field(() => T.String, { description: 'Timestamp of the last update.' })
  public updated_at!: string
}

export type LanguageDocument = DocumentType<Language>
const LanguageModel = getModelForClass(Language)

export default LanguageModel
