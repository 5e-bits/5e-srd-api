var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ClassFeatureSchema   = new Schema({
});

module.exports = mongoose.model('ClassFeature', ClassFeatureSchema, 'classfeatures');