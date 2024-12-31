import { Request, Response, NextFunction } from 'express';
import Collection from '../models/2014/collection/index.js';

export const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await Collection.find({})
      .select({ index: 1, _id: 0 })
      .sort({ index: 'asc' })
      .exec();

    const apiIndex: Record<string, string> = { '2014': '/api/2014' };
    data.forEach((item) => {
      if (item.index === 'levels') return;

      apiIndex[item.index] = `/api/${item.index}`;
    });

    return res.status(200).json(apiIndex);
  } catch (err) {
    next(err);
  }
};
