const { promisify } = require('util');
const Spell = require('../../models/spell');
const { redisClient, escapeRegExp, ResourceList } = require('../../util');
const getAsync = promisify(redisClient.get).bind(redisClient);

exports.index = async (req, res, next) => {
  const searchQueries = {};
  if (req.query.name !== undefined) {
    searchQueries.name = { $regex: new RegExp(escapeRegExp(req.query.name), 'i') };
  }

  if (req.query.level !== undefined) {
    searchQueries.level = { $in: req.query.level.split(',') };
  }

  if (req.query.school !== undefined) {
    const schoolRegex = req.query.school.split(',').map(c => new RegExp(c, 'i'));
    searchQueries['school.name'] = { $in: schoolRegex };
  }

  const redisKey = req.originalUrl;
  const data = await getAsync(redisKey).catch(_err => {
    return;
  });

  if (data) {
    res.status(200).json(JSON.parse(data));
  } else {
    return Spell.find(searchQueries)
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
  return Spell.findOne({ index: req.params.index })
    .then(data => {
      if (!data) return next();
      res.status(200).json(data);
    })
    .catch(err => {
      next(err);
    });
};
