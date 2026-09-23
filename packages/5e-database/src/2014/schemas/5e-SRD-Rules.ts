import { z } from 'zod';
import { APIReferenceSchema } from '../../schemas/common';

export const RuleSchema = z.strictObject({
  index: z.string(),
  name: z.string(),
  desc: z.string().optional(),
  parent: APIReferenceSchema.optional(),
  children: z.array(APIReferenceSchema).optional(),
  url: z.string(),
});
