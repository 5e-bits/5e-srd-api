import Proficiency from '../../models/proficiency/index.js';
import { ResourceList } from '../../util/data.js';
import SimpleController from '../simpleController.js';
import Subrace from '../../models/subrace/index.js';
import Trait from '../../models/trait/index.js';

const simpleController = new SimpleController(Subrace);

export const index = async (req, res, next) => simpleController.index(req, res, next);
export const show = async (req, res, next) => simpleController.show(req, res, next);

export const showTraitsForSubrace = async (req, res, next) => {
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

export const showProficienciesForSubrace = async (req, res, next) => {
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
