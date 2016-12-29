var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var FeatureSchema   = new Schema({
});

module.exports = mongoose.model('Feature', FeatureSchema, 'features');