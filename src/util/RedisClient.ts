import { redisUrl } from './environmentVariables';
import { createClient } from 'redis';

export default createClient({
  url: redisUrl,
});
