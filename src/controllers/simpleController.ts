import { ResourceList } from '../util/data';
import { escapeRegExp } from '../util/regex';

class SimpleController {
  Schema: any
  constructor(Schema: any) {
    this.Schema = Schema;
  }

  async index(req: any, res: any, next: any) {
    const searchQueries: { name?: any } = {};
    if (req.query.name !== undefined) {
      searchQueries.name = { $regex: new RegExp(escapeRegExp(req.query.name), 'i') };
    }

    try {
      const data = await this.Schema.find(searchQueries)
        .select({ index: 1, name: 1, url: 1, _id: 0 })
        .sort({ index: 'asc' })
        .exec();

      return res.status(200).json(ResourceList(data));
    } catch (err) {
      next(err);
    }
  }

  async show(req: any, res: any, next: any) {
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
