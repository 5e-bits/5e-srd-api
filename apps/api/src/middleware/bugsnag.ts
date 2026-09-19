import bugsnag from '@bugsnag/js'
import bugsnagExpress from '@bugsnag/plugin-express'

import { bugsnagApiKey } from '@/util'

const createBugsnagMiddleware = () => {
  if (bugsnagApiKey == null || bugsnagApiKey === '') {
    return null
  }

  const bugsnagClient = bugsnag.start({
    apiKey: bugsnagApiKey,
    plugins: [bugsnagExpress]
  })

  return bugsnagClient.getPlugin('express')
}

const bugsnagMiddleware = createBugsnagMiddleware()

export default bugsnagMiddleware
