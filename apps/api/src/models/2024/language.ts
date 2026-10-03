import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({ description: 'Represents a language spoken in the D&D world.' })
@srdModelOptions('2024-languages')
export class Language2024 {
  @field(T.String, {
    description: 'The unique identifier for this language (e.g., draconic).',
    required: true,
    index: true
  })
  public index!: string

  @field(T.String, {
    description: 'The name of the language (e.g., Draconic).',
    required: true,
    index: true
  })
  public name!: string

  @field(T.Bool, { description: 'Whether the language is rare.', required: true, index: true })
  public is_rare!: boolean

  @field(T.String, { description: 'A note about the language.', required: true, index: true })
  public note!: string

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.String, { description: 'Timestamp of the last update.', required: true, index: true })
  public updated_at!: string
}

export type LanguageDocument = DocumentType<Language2024>
const LanguageModel = getModelForClass(Language2024)

export default LanguageModel
