import { Request, Response, NextFunction } from 'express';
import Proficiency from '@/models/2014/proficiency/index.js';
import { ResourceList } from '@/util/data.js';
import SimpleController from '@/controllers/simpleController.js';
import Subrace from '@/models/2014/subrace/index.js';
import Trait from '@/models/2014/trait/index.js';

const simpleController = new SimpleController(Subrace);

export const index = async (req: Request, res: Response, next: NextFunction) =>
  simpleController.index(req, res, next);
export const show = async (req: Request, res: Response, next: NextFunction) =>
  simpleController.show(req, res, next);

export const showTraitsForSubrace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const urlString = '/api/2014/subraces/' + req.params.index;
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
    const urlString = '/api/2014/subraces/' + req.params.index;

    const data = await Proficiency.find({ 'races.url': urlString })
      .select({ index: 1, name: 1, url: 1, _id: 0 })
      .sort({ index: 'asc' });
    return res.status(200).json(ResourceList(data));
  } catch (err) {
    next(err);
  }
};
