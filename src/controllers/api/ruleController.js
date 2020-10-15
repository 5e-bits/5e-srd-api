const Rule = require('../../models/rule');
const utility = require('./utility');
const { promisify } = require('util');
const { redisClient } = require('../../util');
const getAsync = promisify(redisClient.get).bind(redisClient);

exports.index = async (req, res, next) => {
  const search_queries = {};
  if (req.query.name !== undefined) {
    search_queries.name = { $regex: new RegExp(utility.escapeRegExp(req.query.name), 'i') };
  }
  if (req.query.desc !== undefined) {
    search_queries.desc = { $regex: new RegExp(utility.escapeRegExp(req.query.desc), 'i') };
  }

  const redisKey = req.originalUrl;
  const data = await getAsync(redisKey).catch(_err => {
    return;
  });

  if (data) {
    res.status(200).json(JSON.parse(data));
  } else {
    await Rule.find(search_queries)
      .sort({ index: 'asc' })
      .then(data => {
        res.status(200).json(utility.NamedAPIResource(data));
      })
      .catch(err => {
        next(err);
      });
  }
};

exports.show = async (req, res, next) => {
  await Rule.findOne({ index: req.params.index })
    .then(data => {
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({ error: 'Not found' });
      }
    })
    .catch(err => {
      next(err);
    });
};
