import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import { ResourceList, escapeRegExp, redisClient } from '@/util';

import Monster from '@/models/2014/monster';

// --- Helper Transformation ---
const transformChallengeRating = (val: string | string[] | undefined) => {
  if (!val) return undefined;
  // Ensure it's an array, handling both single string and array inputs
  const arr = Array.isArray(val) ? val : [val];
  // Flatten in case of comma-separated strings inside the array, then split
  const flattened = arr.flatMap((item) => item.split(','));
  // Convert to numbers and filter out NaNs
  const numbers = flattened.map(Number).filter((item) => !isNaN(item));
  // Return undefined if no valid numbers result, otherwise return the array
  return numbers.length > 0 ? numbers : undefined;
};

// --- Zod Schemas ---
const IndexQuerySchema = z.object({
  name: z.string().optional(),
  challenge_rating: z
    .union([z.string(), z.array(z.string())]) // Accept string or array
    .optional()
    .transform(transformChallengeRating), // Use helper transformation
});

const ShowParamsSchema = z.object({
  index: z.string().min(1),
});
// --- End Zod Schemas ---

interface IndexQuery {
  name?: { $regex: RegExp };
  challenge_rating?: { $in: number[] };
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
    const { name, challenge_rating } = validatedQuery.data;

    const searchQueries: IndexQuery = {};
    if (name !== undefined) {
      searchQueries.name = { $regex: new RegExp(escapeRegExp(name), 'i') };
    }
    if (challenge_rating !== undefined && challenge_rating.length > 0) {
      searchQueries.challenge_rating = { $in: challenge_rating };
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
    // Validate path parameters
    const validatedParams = ShowParamsSchema.safeParse(req.params);
    if (!validatedParams.success) {
      return res
        .status(400)
        .json({ error: 'Invalid path parameters', details: validatedParams.error.issues });
    }
    const { index } = validatedParams.data;

    const data = await Monster.findOne({ index: index });
    if (!data) return next();
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};
