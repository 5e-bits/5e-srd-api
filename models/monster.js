var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MonsterSchema   = new Schema({
    name: String
});

module.exports = mongoose.model('Monster', MonsterSchema, 'monsters');