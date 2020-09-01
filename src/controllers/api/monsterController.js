const { promisify } = require('util');
const Monster = require('../../models/monster');
const utility = require('./utility');
const getAsync = promisify(utility.redisClient.get).bind(utility.redisClient);

exports.index = async (req, res, next) => {
  const search_queries = {};
  if (req.query.name !== undefined) {
    search_queries.name = { $regex: new RegExp(utility.escapeRegExp(req.query.name), 'i') };
  }
  if (req.query.challenge_rating !== undefined) {
    search_queries.challenge_rating = { $in: req.query.challenge_rating.split(',') };
  }

  const redisKey = req.originalUrl;
  const data = await getAsync(redisKey);

  if (data) {
    res.status(200).json(JSON.parse(data));
  } else {
    await Monster.find(search_queries)
      .sort({ index: 'asc' })
      .then(async data => {
        const json_data = utility.NamedAPIResource(data);
        utility.redisClient.set(redisKey, JSON.stringify(json_data));
        res.status(200).json(json_data);
      })
      .catch(err => {
        next(err);
      });
  }
};

exports.show = async (req, res, next) => {
  await Monster.findOne({ index: req.params.index })
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
