import { createClient } from 'redis';
import { redisUrl } from './environmentVariables.js';

export default createClient({
  url: redisUrl,
});
