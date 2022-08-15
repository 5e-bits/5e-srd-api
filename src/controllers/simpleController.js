import { ResourceList } from '../util/data.js';
import { escapeRegExp } from '../util/regex.js';

class SimpleController {
  constructor(Schema) {
    this.Schema = Schema;
  }

  async index(req, res, next) {
    try {
      const searchQueries = {};
      if (req.query.name !== undefined) {
        searchQueries.name = { $regex: new RegExp(escapeRegExp(req.query.name), 'i') };
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

  async show(req, res, next) {
    try {
      const data = await this.Schema.findOne({ index: req.params.index });
      if (!data) return next();
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
}

export default SimpleController;
