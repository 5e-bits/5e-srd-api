const utility = require('./api/utility');

class SimpleController {
  constructor(Schema) {
    this.Schema = Schema;
  }

  async index(req, res, next) {
    const search_queries = {};
    if (req.query.name !== undefined) {
      search_queries.name = { $regex: new RegExp(utility.escapeRegExp(req.query.name), 'i') };
    }

    const data = await this.Schema.find(search_queries)
      .sort({ index: 'asc' })
      .catch(err => {
        next(err);
      });
    res.status(200).json(utility.NamedAPIResource(data));
  }

  async show(req, res, next) {
    const data = await this.Schema.findOne({ index: req.params.index }).catch(err => {
      next(err);
    });
    if (!data) return next();
    res.status(200).json(data);
  }
}

module.exports = SimpleController;
