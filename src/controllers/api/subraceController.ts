import Subrace from '../../models/subrace';
import Trait from '../../models/trait';
import Proficiency from '../../models/proficiency';
import { ResourceList } from '../../util/data';
import SimpleController from '../simpleController';
import { Request, Response } from 'express';

const simpleController = new SimpleController(Subrace);

export const index = async (req: Request, res: Response, next: any) => simpleController.index(req, res, next);
export const show = async (req: Request, res: Response, next: any) => simpleController.show(req, res, next);

export const showTraitsForSubrace = async (req: Request, res: Response, next: any) => {
  const urlString = '/api/subraces/' + req.params.index;
  try {
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

export const showProficienciesForSubrace = async (req: Request, res: Response, next: any) => {
  const urlString = '/api/subraces/' + req.params.index;

  try {
    const data = await Proficiency.find({ 'races.url': urlString })
      .select({ index: 1, name: 1, url: 1, _id: 0 })
      .sort({ index: 'asc' });
    return res.status(200).json(ResourceList(data));
  } catch (err) {
    next(err);
  }
};
