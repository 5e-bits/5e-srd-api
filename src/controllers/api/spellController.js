import { ResourceList, escapeRegExp, redisClient } from '../../util/index.js';

import Spell from '../../models/spell/index.js';

export const index = async (req, res, next) => {
  try {
    const searchQueries = {};
    if (req.query.name !== undefined) {
      searchQueries.name = { $regex: new RegExp(escapeRegExp(req.query.name), 'i') };
    }

    if (req.query.level !== undefined) {
      searchQueries.level = { $in: req.query.level };
    }

    if (req.query.school !== undefined) {
      let schoolRegex;
      if (Array.isArray(req.query.school)) {
        schoolRegex = req.query.school.map(c => new RegExp(escapeRegExp(c), 'i'));
      } else {
        schoolRegex = [new RegExp(escapeRegExp(req.query.school), 'i')];
      }
      searchQueries['school.name'] = { $in: schoolRegex };
    }

    const redisKey = req.originalUrl;
    let data;
    data = await redisClient.get(redisKey);

    if (data) {
      res.status(200).json(JSON.parse(data));
    } else {
      const data = await Spell.find(searchQueries)
        .select({ index: 1, name: 1, url: 1, _id: 0 })
        .sort({ index: 'asc' });
      const jsonData = ResourceList(data);
      redisClient.set(redisKey, JSON.stringify(jsonData));
      return res.status(200).json(jsonData);
    }
  } catch (err) {
    next(err);
  }
};

export const show = async (req, res, next) => {
  try {
    const data = await Spell.findOne({ index: req.params.index });
    if (!data) return next();
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};
