const { ResourceList } = require('../util/data');
const { escapeRegExp } = require('../util/regex');

class SimpleController {
  constructor(Schema) {
    this.Schema = Schema;
  }

  index(req, res, next) {
    const searchQueries = {};
    if (req.query.name !== undefined) {
      searchQueries.name = { $regex: new RegExp(escapeRegExp(req.query.name), 'i') };
    }

    return this.Schema.find(searchQueries)
      .select({ index: 1, name: 1, url: 1, _id: 0 })
      .sort({ index: 'asc' })
      .then(data => {
        res.status(200).json(ResourceList(data));
      })
      .catch(err => {
        next(err);
      });
  }

  show(req, res, next) {
    return this.Schema.findOne({ index: req.params.index })
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
