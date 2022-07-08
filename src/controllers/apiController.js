const Collection = require('../models/collection');

exports.index = async (req, res, next) => {
  try {
    const data = await Collection.find({})
      .select({ index: 1, _id: 0 })
      .sort({ index: 'asc' })
      .exec();

    const apiIndex = {};
    data.forEach(item => {
      apiIndex[item.index] = `/api/${item.index}`;
    });

    return res.status(200).json(apiIndex);
  } catch (err) {
    next(err);
  }
};
