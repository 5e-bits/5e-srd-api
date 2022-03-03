// const { noop } = require('lodash');
const { redisHost, redisPort, redisUsername, redisPassword } = require('./environmentVariables');
const { createClient } = require('redis');

module.exports = createClient({
  socket: { host: redisHost, port: redisPort },
  username: redisUsername,
  password: redisPassword,
});
