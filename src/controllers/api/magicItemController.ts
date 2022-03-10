import MagicItem from '../../models/magicItem';
const { redisClient, escapeRegExp, ResourceList } = require('../../util');
import { Request, Response } from 'express';

export const index = async (req: Request, res: Response, next: any) => {
  const searchQueries: { name?: any } = {};
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

export const show = async (req: Request, res: Response, next: any) => {
  try {
    const data = await MagicItem.findOne({ index: req.params.index });
    if (!data) return next();
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};
