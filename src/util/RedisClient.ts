import { createClient } from 'redis'

import { redisUrl } from './environmentVariables'

const isTls = redisUrl.match(/rediss:/) != null
const parsedUrl = new URL(redisUrl)

export default createClient({
  url: redisUrl,
  socket: isTls
    ? {
        tls: true,
        host: parsedUrl.hostname,
        rejectUnauthorized: false
      }
    : undefined
})
