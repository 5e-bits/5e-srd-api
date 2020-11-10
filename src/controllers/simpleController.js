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

    await this.Schema.find(search_queries)
      .sort({ index: 'asc' })
      .then(data => {
        res.status(200).json(utility.NamedAPIResource(data));
      })
      .catch(err => {
        next(err);
      });
  }

  async show(req, res, next) {
    await this.Schema.findOne({ index: req.params.index })
      .then(data => {
        if (!data) return next();
        res.status(200).json(data);
      })
      .catch(err => {
        next(err);
      });
  }
}

module.exports = SimpleController;
