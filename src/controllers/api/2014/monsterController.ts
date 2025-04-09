import { Request, Response, NextFunction } from 'express';

import { ResourceList, escapeRegExp, redisClient } from '@/util';

import Monster from '@/models/2014/monster';

interface IndexQuery {
  name?: { $regex: RegExp };
  challenge_rating?: { $in: string[] | number[] };
}

export const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const searchQueries: IndexQuery = {};
    if (req.query.name !== undefined) {
      searchQueries.name = { $regex: new RegExp(escapeRegExp(req.query.name as string), 'i') };
    }
    if (req.query.challenge_rating !== undefined) {
      if (typeof req.query.challenge_rating === 'string') {
        req.query.challenge_rating = req.query.challenge_rating.split(',');
      }

      const challengeRating = req.query.challenge_rating as string[];
      searchQueries.challenge_rating = {
        $in: challengeRating.map(Number).filter((item) => !isNaN(item)),
      };
    }

    const redisKey = req.originalUrl;
    const data = await redisClient.get(redisKey);

    if (data) {
      res.status(200).json(JSON.parse(data));
    } else {
      const data = await Monster.find(searchQueries)
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
    const data = await Monster.findOne({ index: req.params.index });
    if (!data) return next();
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};
