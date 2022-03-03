const Rule = require('../../models/rule');
const { redisClient, escapeRegExp, ResourceList } = require('../../util');

exports.index = async (req, res, next) => {
  const searchQueries = {};
  if (req.query.name !== undefined) {
    searchQueries.name = { $regex: new RegExp(escapeRegExp(req.query.name), 'i') };
  }
  if (req.query.desc !== undefined) {
    searchQueries.desc = { $regex: new RegExp(escapeRegExp(req.query.desc), 'i') };
  }

  const redisKey = req.originalUrl;
  const data = await redisClient.get(redisKey).catch(_err => {
    return;
  });

  if (data) {
    res.status(200).json(JSON.parse(data));
  } else {
    return Rule.find(searchQueries)
      .select({ index: 1, name: 1, url: 1, _id: 0 })
      .sort({ index: 'asc' })
      .then(data => {
        const jsonData = ResourceList(data);
        redisClient.set(redisKey, JSON.stringify(jsonData));
        res.status(200).json(jsonData);
      })
      .catch(err => {
        next(err);
      });
  }
};

exports.show = (req, res, next) => {
  return Rule.findOne({ index: req.params.index })
    .then(data => {
      if (!data) return next();
      res.status(200).json(data);
    })
    .catch(err => {
      next(err);
    });
};
