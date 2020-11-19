const { promisify } = require('util');
const MagicItem = require('../../models/magicItem');
const utility = require('./utility');
const { redisClient } = require('../../util');
const getAsync = promisify(redisClient.get).bind(redisClient);

exports.index = async (req, res, next) => {
  const searchQueries = {};
  if (req.query.name !== undefined) {
    searchQueries.name = { $regex: new RegExp(utility.escapeRegExp(req.query.name), 'i') };
  }

  const redisKey = req.originalUrl;
  console.log(redisKey);
  const data = await getAsync(redisKey).catch(_err => {
    return;
  });

  if (data) {
    res.status(200).json(JSON.parse(data));
  } else {
    return MagicItem.find(searchQueries)
      .select({ index: 1, name: 1, url: 1, _id: 0 })
      .sort({ index: 'asc' })
      .then(data => {
        const jsonData = utility.ResourceList(data);
        redisClient.set(redisKey, JSON.stringify(jsonData));
        res.status(200).json(jsonData);
      })
      .catch(err => {
        next(err);
      });
  }
};

exports.show = (req, res, next) => {
  return MagicItem.findOne({ index: req.params.index })
    .then(data => {
      if (!data) return next();
      res.status(200).json(data);
    })
    .catch(err => {
      next(err);
    });
};
