import { redisHost, redisPort, redisUsername, redisPassword } from './environmentVariables';
import { createClient } from 'redis';

export default createClient({
  socket: { host: redisHost, port: redisPort },
  username: redisUsername,
  password: redisPassword,
});
