import { Request, Response, NextFunction } from 'express';
import { ReturnModelType } from '@typegoose/typegoose';
import { z } from 'zod';

import { ResourceList } from '@/util/data';
import { escapeRegExp } from '@/util/regex';

// Define schema for index query parameters
const IndexQuerySchema = z.object({
  name: z.string().optional(),
  // Add other query parameters here if needed
});

// Define schema for show path parameters
const ShowParamsSchema = z.object({
  index: z.string().min(1), // Ensure index is a non-empty string
});

interface IndexQuery {
  name?: { $regex: RegExp };
}

class SimpleController {
  Schema: ReturnModelType<any>;

  constructor(Schema: ReturnModelType<any>) {
    this.Schema = Schema;
  }

  async index(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate query parameters
      const validatedQuery = IndexQuerySchema.safeParse(req.query);

      if (!validatedQuery.success) {
        // Handle validation errors - customize error response as needed
        return res
          .status(400)
          .json({ error: 'Invalid query parameters', details: validatedQuery.error.issues });
      }

      const { name } = validatedQuery.data;

      const searchQueries: IndexQuery = {};
      if (name !== undefined) {
        // Use validated name
        searchQueries.name = { $regex: new RegExp(escapeRegExp(name), 'i') };
      }

      const data = await this.Schema.find(searchQueries)
        .select({ index: 1, name: 1, url: 1, _id: 0 })
        .sort({ index: 'asc' })
        .exec();

      return res.status(200).json(ResourceList(data));
    } catch (err) {
      next(err);
    }
  }

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate path parameters
      const validatedParams = ShowParamsSchema.safeParse(req.params);

      if (!validatedParams.success) {
        // Handle validation errors
        return res
          .status(400)
          .json({ error: 'Invalid path parameters', details: validatedParams.error.issues });
      }

      const { index } = validatedParams.data; // Use validated index

      // Use validated index in the query
      const data = await this.Schema.findOne({ index });
      if (!data) return next();
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
}

export default SimpleController;
