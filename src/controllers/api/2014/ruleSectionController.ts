import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ResourceList, escapeRegExp, redisClient } from '@/util';

import RuleSection from '@/models/2014/ruleSection';

// --- Zod Schemas ---
const IndexQuerySchema = z.object({
  name: z.string().optional(),
  desc: z.string().optional(),
});

const ShowParamsSchema = z.object({
  index: z.string().min(1),
});
// --- End Zod Schemas ---

interface IndexQuery {
  name?: { $regex: RegExp };
  desc?: { $regex: RegExp };
}

export const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate query parameters
    const validatedQuery = IndexQuerySchema.safeParse(req.query);
    if (!validatedQuery.success) {
      return res
        .status(400)
        .json({ error: 'Invalid query parameters', details: validatedQuery.error.issues });
    }
    const { name, desc } = validatedQuery.data;

    const searchQueries: IndexQuery = {};
    if (name !== undefined) {
      searchQueries.name = { $regex: new RegExp(escapeRegExp(name), 'i') };
    }
    if (desc !== undefined) {
      searchQueries.desc = { $regex: new RegExp(escapeRegExp(desc), 'i') };
    }

    const redisKey = req.originalUrl;
    const data = await redisClient.get(redisKey);

    if (data) {
      res.status(200).json(JSON.parse(data));
    } else {
      const data = await RuleSection.find(searchQueries)
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
    // Validate path parameters
    const validatedParams = ShowParamsSchema.safeParse(req.params);
    if (!validatedParams.success) {
      return res
        .status(400)
        .json({ error: 'Invalid path parameters', details: validatedParams.error.issues });
    }
    const { index } = validatedParams.data;

    const data = await RuleSection.findOne({ index: index });
    if (!data) return next();
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};
