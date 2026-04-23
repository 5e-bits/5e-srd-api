import { Arg, Query, Resolver } from 'type-graphql'

import Locale2014Model, { Locale2014 } from '@/models/2014/locale'

@Resolver(Locale2014)
export class LocaleResolver {
  @Query(() => [Locale2014], {
    description: 'Gets all supported translation locales for the 2014 SRD.'
  })
  async locales2014(): Promise<Locale2014[]> {
    return Locale2014Model.find().sort({ lang: 'asc' }).lean()
  }

  @Query(() => Locale2014, {
    nullable: true,
    description: 'Gets a single 2014 locale by BCP 47 language tag (e.g. "de", "fr").'
  })
  async locale2014(@Arg('lang', () => String) lang: string): Promise<Locale2014 | null> {
    return Locale2014Model.findOne({ lang }).lean()
  }
}
