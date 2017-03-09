var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var LevelSchema   = new Schema({
    level: Number,
    url: String
});

module.exports = mongoose.model('Level', LevelSchema, 'levels');
