const Spell = require('../../models/spell');
const utility = require('./utility');

exports.index = async (req, res, next) => {
  const search_queries = {};
  if (req.query.name !== undefined) {
    search_queries.name = { $regex: new RegExp(utility.escapeRegExp(req.query.name), 'i') };
  }

  if (req.query.level !== undefined) {
    search_queries.level = +req.query.level;
  }
  
  if (req.query.classes !== undefined) {
    var classes = req.query.classes.split(",").map(
      (c) => new RegExp(c, "i")
    );
    search_queries["classes.name"] = { "$in": classes }; 
  }

  if (req.query.school !== undefined) {
    search_queries["school.name"] = { $regex: new RegExp(utility.escapeRegExp(req.query.school), 'i') };
  }

  await Spell.find(search_queries)
    .sort({ index: 'asc' })
    .then(data => {
      res.status(200).json(utility.NamedAPIResource(data));
    })
    .catch(err => {
      next(err);
    });
};

exports.show = async (req, res, next) => {
  await Spell.findOne({ index: req.params.index })
    .then(data => {
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({ error: 'Not found' });
      }
    })
    .catch(err => {
      next(err);
    });
};