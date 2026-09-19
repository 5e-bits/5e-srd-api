import { Arg, Query, Resolver } from 'type-graphql'

import Locale2024Model, { Locale2024 } from '@/models/2024/locale'

@Resolver(Locale2024)
export class LocaleResolver {
  @Query(() => [Locale2024], {
    description: 'Gets all supported translation locales for the 2024 SRD.'
  })
  async locales2024(): Promise<Locale2024[]> {
    return Locale2024Model.find().sort({ lang: 'asc' }).lean()
  }

  @Query(() => Locale2024, {
    nullable: true,
    description: 'Gets a single 2024 locale by BCP 47 language tag (e.g. "de", "fr").'
  })
  async locale2024(@Arg('lang', () => String) lang: string): Promise<Locale2024 | null> {
    return Locale2024Model.findOne({ lang }).lean()
  }
}
