const Class = require('../../models/class');
const Subclass = require('../../models/subclass');
const Level = require('../../models/level');
const StartingEquipment = require('../../models/startingEquipment');
const Spellcasting = require('../../models/spellcasting');
const utility = require('./utility');

exports.index = async (req, res, next) => {
  const search_queries = {};
  if (req.query.name !== undefined) {
    search_queries.name = req.query.name;
  }

  await Class.find(search_queries)
    .sort({ index: 'asc' })
    .then(data => {
      res.status(200).json(utility.NamedAPIResource(data));
    })
    .catch(err => {
      next(err);
    });
};

exports.show = async (req, res, next) => {
  await Class.findOne({ index: req.params.index })
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

exports.showLevelsForClass = async (req, res, next) => {
  let urlString = '/api/classes/' + req.params.index;
  await Level.find({ 'class.url': urlString })
    .sort({ level: 'asc' })
    .then(data => {
      if (data && data.length) {
        res.status(200).json(data);
      } else {
        res.status(404).json({ error: 'Not found' });
      }
    })
    .catch(err => {
      next(err);
    });
};

exports.showLevelForClass = async (req, res, next) => {
  if (!Number.isInteger(parseInt(req.params.level))) {
    return res.status(404).json({ error: 'Not found' });
  }

  let urlString = '/api/classes/' + req.params.index + '/level/' + req.params.level;

  await Level.findOne({ url: urlString })
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

exports.showSubclassesForClass = async (req, res, next) => {
  let urlString = '/api/classes/' + req.params.index;
  await Subclass.find({ 'class.url': urlString })
    .sort({ url: 'asc', level: 'asc' })
    .then(data => {
      if (data && data.length) {
        res.status(200).json(utility.NamedAPIResource(data));
      } else {
        res.status(404).json({ error: 'Not found' });
      }
    })
    .catch(err => {
      next(err);
    });
};

exports.showStartingEquipmentForClass = async (req, res, next) => {
  let urlString = '/api/classes/' + req.params.index;

  await StartingEquipment.findOne({ 'class.url': urlString })
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      next(err);
    });
};

exports.showSpellcastingForClass = async (req, res, next) => {
  let urlString = '/api/classes/' + req.params.index;

  await Spellcasting.findOne({ 'class.url': urlString })
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      next(err);
    });
};
