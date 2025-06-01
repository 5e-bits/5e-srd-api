import { createClient } from 'redis'

import { redisUrl } from './environmentVariables'

export default createClient({
  url: redisUrl,
  socket: {
    tls: redisUrl.match(/rediss:/) != null,
    rejectUnauthorized: false
  }
})
