import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ResourceList, escapeRegExp, redisClient } from '@/util';

// --- Zod Schemas ---
const IndexQuerySchema = z.object({
  name: z.string().optional(),
  level: z
    .union([z.string().regex(/^\d+$/), z.array(z.string().regex(/^\d+$/))])
    .optional()
    .transform((val) => (val ? (Array.isArray(val) ? val : [val]) : undefined)),
  school: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => (val ? (Array.isArray(val) ? val : [val]) : undefined)),
});

const ShowParamsSchema = z.object({
  index: z.string().min(1),
});
// --- End Zod Schemas ---

interface IndexQuery {
  name?: { $regex: RegExp };
  level?: { $in: string[] };
  'school.name'?: { $in: RegExp[] };
}

import Spell from '@/models/2014/spell';

export const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedQuery = IndexQuerySchema.safeParse(req.query);
    if (!validatedQuery.success) {
      return res
        .status(400)
        .json({ error: 'Invalid query parameters', details: validatedQuery.error.issues });
    }
    const { name, level, school } = validatedQuery.data;

    const searchQueries: IndexQuery = {};
    if (name !== undefined) {
      searchQueries.name = { $regex: new RegExp(escapeRegExp(name), 'i') };
    }

    if (level !== undefined) {
      searchQueries.level = { $in: level };
    }

    if (school !== undefined) {
      const schoolRegex = school.map((s) => new RegExp(escapeRegExp(s), 'i'));
      searchQueries['school.name'] = { $in: schoolRegex };
    }

    const redisKey = req.originalUrl;
    const data = await redisClient.get(redisKey);

    if (data) {
      res.status(200).json(JSON.parse(data));
    } else {
      const data = await Spell.find(searchQueries)
        .select({ index: 1, level: 1, name: 1, url: 1, _id: 0 })
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
    const validatedParams = ShowParamsSchema.safeParse(req.params);
    if (!validatedParams.success) {
      return res
        .status(400)
        .json({ error: 'Invalid path parameters', details: validatedParams.error.issues });
    }
    const { index } = validatedParams.data;

    const data = await Spell.findOne({ index: index });
    if (!data) return next();
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};
