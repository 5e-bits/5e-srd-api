const RuleSection = require('../../models/ruleSection');
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
    const data = await RuleSection.find(search_queries)
      .sort({ index: 'asc' })
      .catch(err => {
        next(err);
      });

    const json_data = utility.NamedAPIResource(data);
    redisClient.set(redisKey, JSON.stringify(json_data));
    res.status(200).json(json_data);
  }
};

exports.show = async (req, res, next) => {
  const data = await RuleSection.findOne({ index: req.params.index }).catch(err => {
    next(err);
  });

  if (!data) return next();
  res.status(200).json(data);
};
