import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import languageNegotiation, { normalizeLang } from '@/middleware/languageNegotiation'

describe('normalizeLang', () => {
  it.each([
    ['pt-br', 'pt-BR'],
    ['PT-BR', 'pt-BR'],
    ['fr-fr', 'fr-FR'],
    ['EN', 'en'],
    ['zh-hant-tw', 'zh-Hant-TW'],
    ['pt-BR', 'pt-BR']
  ])('canonicalizes %s to %s', (input, expected) => {
    expect(normalizeLang(input)).toBe(expected)
  })

  it('returns tags Intl cannot canonicalize unchanged', () => {
    expect(normalizeLang('i-klingon')).toBe('i-klingon')
    expect(normalizeLang('x-foo')).toBe('x-foo')
  })
})

describe('languageNegotiation', () => {
  const run = (options: Parameters<typeof createRequest>[0]) => {
    const req = createRequest(options)
    const next = vi.fn()
    languageNegotiation(req, createResponse(), next)
    expect(next).toHaveBeenCalledOnce()
    return req.lang
  }

  it('normalizes the lang query param casing', () => {
    expect(run({ query: { lang: 'pt-br' } })).toBe('pt-BR')
  })

  it('normalizes the Accept-Language header casing', () => {
    expect(run({ headers: { 'accept-language': 'fr-fr,en;q=0.5' } })).toBe('fr-FR')
  })

  it('prefers the query param over the header', () => {
    expect(run({ query: { lang: 'pt-br' }, headers: { 'accept-language': 'fr-FR' } })).toBe('pt-BR')
  })

  it('falls back to en for missing or invalid tags', () => {
    expect(run({})).toBe('en')
    expect(run({ query: { lang: 'not a tag!' } })).toBe('en')
  })
})
