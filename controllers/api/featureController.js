const Feature = require('../../models/feature');
const utility = require('./utility');

exports.index = (req, res, next) => {
  Feature.find((err, _data) => {
    if (err) {
      next(err);
    }
  })
    .sort({ index: 'asc' })
    .exec((err, data) => {
      if (err) {
        next(err);
      }
      res.status(200).json(utility.NamedAPIResource(data));
    });
};

exports.show = (req, res, next) => {
  // TODO: Move this out of here
  if (utility.isClassName(req.params.index) === true) {
    Feature.find(
      {
        'class.name': utility.class_map[req.params.index],
        'subclass.name': undefined,
        group: undefined
      },
      (err, _data) => {
        if (err) {
          next(err);
        }
      }
    )
      .sort({ url: 'asc', level: 'asc' })
      .exec((err, data) => {
        if (err) {
          next(err);
        }
        res.status(200).json(utility.NamedAPIResource(data));
      });
  } else if (utility.isSubclassName(req.params.index) === true) {
    console.log(utility.subclass_map[req.params.index]);
    Feature.find(
      {
        'subclass.name': utility.subclass_map[req.params.index],
        group: undefined
      },
      (err, _data) => {
        if (err) {
          next(err);
        }
      }
    )
      .sort({ url: 'asc', level: 'asc' })
      .exec((err, data) => {
        if (err) {
          next(err);
        }
        res.status(200).json(utility.NamedAPIResource(data));
      });
  } else {
    // return specific document
    Feature.findOne({ index: req.params.index }, (err, data) => {
      if (err) {
        next(err);
      }

      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({ error: 'Not found' });
      }
    });
  }
};

exports.showForLevel = (req, res, next) => {
  if (typeof parseInt(req.params.level) == 'number') {
    if (utility.isClassName(req.params.index) === true) {
      Feature.find(
        {
          'class.name': utility.class_map[req.params.index],
          level: parseInt(req.params.level),
          'subclass.name': undefined,
          group: undefined
        },
        (err, _data) => {
          if (err) {
            next(err);
          }
        }
      )
        .sort({ url: 'asc', level: 'asc' })
        .exec((err, data) => {
          if (err) {
            next(err);
          }
          res.status(200).json(utility.NamedAPIResource(data));
        });
    } else if (utility.isSubclassName(req.params.index) === true) {
      Feature.find(
        {
          level: parseInt(req.params.level),
          'subclass.name': utility.subclass_map[req.params.index],
          group: undefined
        },
        (err, _data) => {
          if (err) {
            next(err);
          }
        }
      )
        .sort({ url: 'asc', level: 'asc' })
        .exec((err, data) => {
          if (err) {
            next(err);
          }
          res.status(200).json(utility.NamedAPIResource(data));
        });
    }
  } else {
    res.status(404).json({ error: 'Not found' });
  }
};
