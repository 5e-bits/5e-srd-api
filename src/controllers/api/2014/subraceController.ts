import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import Proficiency from '@/models/2014/proficiency';
import { ResourceList } from '@/util/data';
import SimpleController from '@/controllers/simpleController';
import Subrace from '@/models/2014/subrace';
import Trait from '@/models/2014/trait';

// --- Zod Schema ---
const ParamsSchema = z.object({
  index: z.string().min(1),
});
// --- End Zod Schema ---

const simpleController = new SimpleController(Subrace);

export const index = async (req: Request, res: Response, next: NextFunction) =>
  simpleController.index(req, res, next);
export const show = async (req: Request, res: Response, next: NextFunction) =>
  simpleController.show(req, res, next);

export const showTraitsForSubrace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate path parameters
    const validatedParams = ParamsSchema.safeParse(req.params);
    if (!validatedParams.success) {
      return res
        .status(400)
        .json({ error: 'Invalid path parameters', details: validatedParams.error.issues });
    }
    const { index } = validatedParams.data;

    const urlString = '/api/2014/subraces/' + index;
    const data = await Trait.find({ 'subraces.url': urlString }).select({
      index: 1,
      name: 1,
      url: 1,
      _id: 0,
    });

    return res.status(200).json(ResourceList(data));
  } catch (err) {
    next(err);
  }
};

export const showProficienciesForSubrace = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate path parameters
    const validatedParams = ParamsSchema.safeParse(req.params);
    if (!validatedParams.success) {
      return res
        .status(400)
        .json({ error: 'Invalid path parameters', details: validatedParams.error.issues });
    }
    const { index } = validatedParams.data;

    const urlString = '/api/2014/subraces/' + index;

    const data = await Proficiency.find({ 'races.url': urlString })
      .select({ index: 1, name: 1, url: 1, _id: 0 })
      .sort({ index: 'asc' });
    return res.status(200).json(ResourceList(data));
  } catch (err) {
    next(err);
  }
};
