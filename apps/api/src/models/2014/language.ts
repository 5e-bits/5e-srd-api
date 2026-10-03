import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({ description: 'Represents a language spoken in the D&D world.' })
@srdModelOptions('2014-languages')
export class Language {
  @field(T.String, {
    description: 'A brief description of the language.',
    index: true,
    gql: { nullable: true }
  })
  public desc?: string

  @field(T.String, {
    description: 'The unique identifier for this language (e.g., common).',
    required: true,
    index: true
  })
  public index!: string

  @field(T.String, {
    description: 'The name of the language (e.g., Common).',
    required: true,
    index: true
  })
  public name!: string

  @field(T.String, {
    description: 'The script used to write the language (e.g., Common, Elvish).',
    index: true,
    gql: { nullable: true }
  })
  public script?: string

  @field(T.String, {
    description: 'The type of language (e.g., Standard, Exotic).',
    required: true,
    index: true
  })
  public type!: string

  @field(T.List(T.String), { description: 'Typical speakers of the language.', index: true })
  public typical_speakers!: string[]

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.String, { description: 'Timestamp of the last update.', required: true, index: true })
  public updated_at!: string
}

export type LanguageDocument = DocumentType<Language>
const LanguageModel = getModelForClass(Language)

export default LanguageModel
