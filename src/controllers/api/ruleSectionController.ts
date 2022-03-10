import RuleSection from '../../models/ruleSection';
import { redisClient, escapeRegExp, ResourceList } from '../../util';
import { Request, Response } from 'express';

export const index = async (req: any, res: any, next: any) => {
  const searchQueries: { name?: any, desc?: any } = {};
  if (req.query.name !== undefined) {
    searchQueries.name = { $regex: new RegExp(escapeRegExp(req.query.name), 'i') };
  }
  if (req.query.desc !== undefined) {
    searchQueries.desc = { $regex: new RegExp(escapeRegExp(req.query.desc), 'i') };
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
      const data = await RuleSection.find(searchQueries)
        .select({ index: 1, name: 1, url: 1 })
        .sort({ index: 'asc' });
      const jsonData = ResourceList(data);
      redisClient.set(redisKey, JSON.stringify(jsonData));
      return res.status(200).json(jsonData);
    } catch (err) {
      next(err);
    }
  }
};

export const show = async (req: any, res: any, next: any) => {
  try {
    const data = await RuleSection.findOne({ index: req.params.index });
    if (!data) return next();
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};
