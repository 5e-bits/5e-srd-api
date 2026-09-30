import * as Sentry from '@sentry/node'

import { sentryDsn } from '@/util/environmentVariables'

const sentryEnabled = sentryDsn != null && sentryDsn !== ''

if (sentryEnabled) {
  Sentry.init({ dsn: sentryDsn })
}

export { Sentry, sentryEnabled }
