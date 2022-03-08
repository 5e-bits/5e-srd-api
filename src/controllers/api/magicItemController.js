const MagicItem = require('../../models/magicItem');
const { redisClient, escapeRegExp, ResourceList } = require('../../util');

exports.index = async (req, res, next) => {
  const searchQueries = {};
  if (req.query.name !== undefined) {
    searchQueries.name = { $regex: new RegExp(escapeRegExp(req.query.name), 'i') };
  }

  const redisKey = req.originalUrl;
  let data;
  try {
    data = await redisClient.get(redisKey);
  } catch (err) {
    return;
  }

  if (data) {
    res.status(200).json(JSON.parse(data));
  } else {
    try {
      const data = await MagicItem.find(searchQueries)
        .select({ index: 1, name: 1, url: 1, _id: 0 })
        .sort({ index: 'asc' });
      const jsonData = ResourceList(data);
      redisClient.set(redisKey, JSON.stringify(jsonData));
      return res.status(200).json(jsonData);
    } catch (err) {
      next(err);
    }
  }
};

exports.show = async (req, res, next) => {
  try {
    const data = await MagicItem.findOne({ index: req.params.index });
    if (!data) return next();
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};
