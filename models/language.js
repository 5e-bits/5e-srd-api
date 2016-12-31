var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var LanguageSchema   = new Schema({
    name: String,
    url: String
});

module.exports = mongoose.model('Language', LanguageSchema, 'languages');