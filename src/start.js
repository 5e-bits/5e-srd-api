const mongoose = require('mongoose');
const { promisify } = require('util');
const { mongodbUri, redisClient } = require('./util');
const createApp = require('./server');
const flushAsync = promisify(redisClient.flushall).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

const MagicItem = require('./models/magicItem');
const Spell = require('./models/spell');
const Monster = require('./models/monster');
const Rule = require('./models/rule');
const RuleSection = require('./models/ruleSection');
const utility = require('./controllers/api/utility');
const prewarmCache = async ({ Schema, endpoint }) => {
  const toPrewarm = [
    {
      Schema: MagicItem,
      endpoint: '/api/magic-items'
    },
    {
      Schema: Spell,
      endpoint: '/api/spells'
    },
    {
      Schema: Monster,
      endpoint: '/api/monsters'
    },
    {
      Schema: Rule,
      endpoint: '/api/rules'
    },
    {
      Schema: RuleSection,
      endpoint: '/api/rule-sections'
    }
  ];
  for (const element of toPrewarm) {
    const data = await element.Schema.find()
      .select({ index: 1, name: 1, url: 1, _id: 0 })
      .sort({ index: 'asc' });
    const jsonData = utility.ResourceList(data);
    await setAsync(element.endpoint, JSON.stringify(jsonData));
  }
};

const start = async () => {
  await mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Database connection ready');

  console.log('Flushing Redis');
  await flushAsync();

  console.log('Prewarm Redis');
  const toPrewarm = [
    {
      Schema: MagicItem,
      endpoint: '/api/magic-items'
    },
    {
      Schema: Spell,
      endpoint: '/api/spells'
    },
    {
      Schema: Monster,
      endpoint: '/api/monsters'
    },
    {
      Schema: Rule,
      endpoint: '/api/rules'
    },
    {
      Schema: RuleSection,
      endpoint: '/api/rule-sections'
    }
  ];
  for (const endpoint of toPrewarm) {
    await prewarmCache(endpoint);
  }

  console.log('Setting up Express server');
  const app = await createApp();

  console.log('Starting server...');
  const server = app.listen(process.env.PORT || 3000, () => {
    const port = server.address().port;
    console.log(`Listening on port ${port}! 🚀`);
  });
};

start().catch(err => {
  console.error(err);
  process.exit(1);
});
