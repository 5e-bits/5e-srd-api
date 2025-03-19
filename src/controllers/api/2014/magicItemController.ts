import { Request, Response, NextFunction } from 'express';

import { ResourceList, escapeRegExp, redisClient } from '@/util/index.js';
import MagicItem from '@/models/2014/magicItem/index.js';

interface IndexQuery {
  name?: { $regex: RegExp };
}

export const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const searchQueries: IndexQuery = {};
    if (req.query.name !== undefined) {
      searchQueries.name = { $regex: new RegExp(escapeRegExp(req.query.name as string), 'i') };
    }

    const redisKey = req.originalUrl;
    const data = await redisClient.get(redisKey);

    if (data) {
      res.status(200).json(JSON.parse(data));
    } else {
      const data = await MagicItem.find(searchQueries)
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

export const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await MagicItem.findOne({ index: req.params.index });
    if (!data) return next();
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};
