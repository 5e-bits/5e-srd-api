const SuggestedCharacteristics = require('../../models/suggestedCharacteristics');
const { BackgroundAPIResource } = require('../../util/data');

exports.index = (req, res, next) => {
    return SuggestedCharacteristics.find()
      .sort({ index: 'asc' })
      .then(data => {
        res.status(200).json(BackgroundAPIResource(data));
      })
      .catch(err => {
        next(err);
      });
  };
  
  exports.show = (req, res, next) => {
    return SuggestedCharacteristics.findOne({ index: req.params.index })
      .then(data => {
        if (!data) return next();
        res.status(200).json(data);
      })
      .catch(err => {
        next(err);
      });
  };