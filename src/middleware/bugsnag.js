const bugsnag = require('@bugsnag/js');
const bugsnagExpress = require('@bugsnag/plugin-express');
const { bugsnagApiKey } = require('../util');

const createBugsnagMiddleware = () => {
  const bugsnagClient = bugsnag.start({
    apiKey: bugsnagApiKey,
    plugins: [bugsnagExpress],
  });

  return bugsnagClient.getPlugin('express');
};

const bugsnagMiddleware = createBugsnagMiddleware();

module.exports.bugsnagMiddleware = bugsnagMiddleware;
