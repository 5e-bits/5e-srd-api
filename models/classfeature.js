var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ClassFeatureSchema   = new Schema({
    name: String,
    class: String,
    subclass: String,
    level: Number,
    desc: [String],
});

module.exports = mongoose.model('ClassFeature', ClassFeatureSchema, 'classfeatures');