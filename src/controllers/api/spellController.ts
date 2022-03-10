import Spell from '../../models/spell';
import { redisClient, escapeRegExp, ResourceList } from '../../util';
import { Request, Response } from 'express';

export const index = async (req: Request, res: Response, next: any) => {
  const searchQueries: { name?: any, level?: any } = {};
  if (req.query.name !== undefined) {
    searchQueries.name = { $regex: new RegExp(escapeRegExp(req.query.name as string), 'i') };
  }

  // if (req.query.level !== undefined) {
  //   searchQueries.level = { $in: req.query.level.split(',') };
  // }

  // if (req.query.school !== undefined) {
  //   const schoolRegex = req.query.school.split(',').map(c => new RegExp(escapeRegExp(c), 'i'));
  //   searchQueries['school.name'] = { $in: schoolRegex };
  // }

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
      const data = await Spell.find(searchQueries)
        .select({ index: 1, name: 1, url: 1 })
        .sort({ index: 'asc' })
        .exec();

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
    const data = await Spell.findOne({ index: req.params.index });
    if (!data) return next();
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};
