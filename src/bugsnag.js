const bugsnag = require('@bugsnag/js');
const bugsnagExpress = require('@bugsnag/plugin-express');
const { bugsnagApiKey } = require('./util');

const bugsnagMiddleware = () => {
  const bugsnagClient = bugsnag(bugsnagApiKey);
  return bugsnagClient.use(bugsnagExpress);
};

module.exports.bugsnagMiddleware = bugsnagMiddleware;
