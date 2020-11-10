const { promisify } = require('util');
const Spell = require('../../models/spell');
const utility = require('./utility');
const { redisClient } = require('../../util');
const getAsync = promisify(redisClient.get).bind(redisClient);

exports.index = async (req, res, next) => {
  const search_queries = {};
  if (req.query.name !== undefined) {
    search_queries.name = { $regex: new RegExp(utility.escapeRegExp(req.query.name), 'i') };
  }

  if (req.query.level !== undefined) {
    search_queries.level = { $in: req.query.level.split(',') };
  }

  if (req.query.school !== undefined) {
    const schoolRegex = req.query.school.split(',').map(c => new RegExp(c, 'i'));
    search_queries['school.name'] = { $in: schoolRegex };
  }

  const redisKey = req.originalUrl;
  const data = await getAsync(redisKey).catch(_err => {
    return;
  });

  if (data) {
    res.status(200).json(JSON.parse(data));
  } else {
    const data = await Spell.find(search_queries)
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
  const data = await Spell.findOne({ index: req.params.index }).catch(err => {
    next(err);
  });

  if (!data) return next();
  res.status(200).json(data);
};
