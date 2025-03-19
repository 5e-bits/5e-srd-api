import bugsnag from '@bugsnag/js';
import { bugsnagApiKey } from '@/util/index.js';
import bugsnagExpress from '@bugsnag/plugin-express';

const createBugsnagMiddleware = () => {
  if (!bugsnagApiKey) {
    return null;
  }

  const bugsnagClient = bugsnag.start({
    apiKey: bugsnagApiKey,
    plugins: [bugsnagExpress],
  });

  return bugsnagClient.getPlugin('express');
};

const bugsnagMiddleware = createBugsnagMiddleware();

export default bugsnagMiddleware;
