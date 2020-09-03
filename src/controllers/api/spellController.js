const Spell = require('../../models/spell');
const utility = require('./utility');
const { redisClient } = require('../../util');

exports.index = async (req, res, next) => {
  const search_queries = {};
  if (req.query.name !== undefined) {
    search_queries.name = { $regex: new RegExp(utility.escapeRegExp(req.query.name), 'i') };
  }

  const redisKey = req.originalUrl;
  const data = await redisClient.getDataFromCache(redisKey);

  if (data) {
    res.status(200).json(JSON.parse(data));
  } else {
    await Spell.find(search_queries)
      .sort({ index: 'asc' })
      .then(async data => {
        const json_data = utility.NamedAPIResource(data);
        redisClient.set(redisKey, JSON.stringify(json_data));
        res.status(200).json(json_data);
      })
      .catch(err => {
        next(err);
      });
  }
};

exports.show = async (req, res, next) => {
  await Spell.findOne({ index: req.params.index })
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
