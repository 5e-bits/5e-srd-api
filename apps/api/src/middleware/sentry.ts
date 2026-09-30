import { readFileSync } from 'node:fs'

import * as Sentry from '@sentry/node'

import { sentryDsn } from '@/util/environmentVariables'

const sentryEnabled = sentryDsn != null && sentryDsn !== ''

if (sentryEnabled) {
  // cwd is apps/api in Docker and under pnpm scripts; release-please bumps this version.
  const { name, version } = JSON.parse(readFileSync('package.json', 'utf8')) as {
    name: string
    version: string
  }
  Sentry.init({
    dsn: sentryDsn,
    release: process.env.SENTRY_RELEASE ?? `${name}@${version}`
  })
}

export { Sentry, sentryEnabled }
