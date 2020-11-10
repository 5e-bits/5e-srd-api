const { promisify } = require('util');
const Monster = require('../../models/monster');
const utility = require('./utility');
const { redisClient } = require('../../util');
const getAsync = promisify(redisClient.get).bind(redisClient);

exports.index = async (req, res, next) => {
  const search_queries = {};
  if (req.query.name !== undefined) {
    search_queries.name = { $regex: new RegExp(utility.escapeRegExp(req.query.name), 'i') };
  }
  if (req.query.challenge_rating !== undefined) {
    search_queries.challenge_rating = { $in: req.query.challenge_rating.split(',') };
  }

  const redisKey = req.originalUrl;
  const data = await getAsync(redisKey).catch(_err => {
    return;
  });

  if (data) {
    res.status(200).json(JSON.parse(data));
  } else {
    return Monster.find(search_queries)
      .sort({ index: 'asc' })
      .then(data => {
        const json_data = utility.NamedAPIResource(data);
        redisClient.set(redisKey, JSON.stringify(json_data));
        res.status(200).json(json_data);
      })
      .catch(err => {
        next(err);
      });
  }
};

exports.show = (req, res, next) => {
  return Monster.findOne({ index: req.params.index })
    .then(data => {
      if (!data) return next();
      res.status(200).json(data);
    })
    .catch(err => {
      next(err);
    });
};
